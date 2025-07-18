<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProjectResource;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoretaskRequest;
use App\Http\Requests\UpdatetaskRequest;
use App\Models\Project;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        $query = Task::where(function ($q) use ($user){
            $q->where('created_by', $user->id)
            ->orWhereHas('project', function ($projectQuery) use ($user) {
                $projectQuery->where(function ($sub) use ($user) {
                    $sub->whereNull('group_id')->where('created_by', $user->id);
                })->orWhereHas('group.users', function ($groupUserQuery) use ($user){
                    $groupUserQuery->where('user_id', $user->id);
                });
            });
        });

        $sortField = request("sort_field", "created_at");
        $sortDirection = request("sort_direction", "desc");

        if (request("name")) {
            $query->where("name", "like", "%". request("name"). "%");;
        }

        if(request("status")) {
            $query->where("status", request("status"));
        }

        $tasks = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);
         
        return inertia("Task/Index", [
            "tasks" => TaskResource::collection($tasks),
            'queryParams' => request()->query() ?: null,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $project = Project::findOrFail(request('project_id'));
        $this->authorizeProjectOwner(new Task(), $project);

        $assignableUsers = $project->group_id
            ? $project->group->users
            : collect([$project->owner]);

        return inertia('Task/Create', [
            'project' => new ProjectResource($project),
            'assignableUsers' => UserResource::collection($assignableUsers),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoretaskRequest $request)
    {
        $project = Project::with('group.users')->findOrFail($request->project_id);
        $this->authorizeProjectOwner(new Task(), $project);

        $data = $request->validated();
        $data['created_by'] = Auth::id();
        $data['updated_by'] = Auth::id();

        if($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('task/' .Str::random(), 'public');
        }

        Task::create($data);

        return to_route('task.index')->with('success', 'Task was created');
    }

    /**
     * Display the specified resource.
     */
    public function show(task $task)
    {
        $project = Project::with('group.users')->findOrFail($task->project_id);
        $this->authorizeProjectOwner($task, $project);
        
        return inertia('Task/Show', [
            'task' => new TaskResource($task),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(task $task)
    {
        $project = Project::with('group.users')->findOrFail($task->project_id);

        $this->authorizeProjectOwner($task, $project);

        $assignableUsers = $project->group_id
            ? $project->group->users
            : collect([$project->owner]);

        return inertia('Task/Edit', [
            'task' => new TaskResource($task),
            'project' => [
                'id' => $project->id,
                'name' => $project->name,
            ],
            'assignableUsers' => UserResource::collection($assignableUsers),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatetaskRequest $request, task $task)
    {
        $project = Project::with('group.users')->findOrFail($task->project_id);
        $this->authorizeProjectOwner($task, $project);

        $data = $request->validated();
        $task->update($data);
        $data['updated_by'] = Auth::id();

        if($request->hasFile('image')) {
            if ($task->image_path) {
                Storage::disk('public')->deleteDirectory(dirname($task->image_path));
            }
            $data['image_path'] = $request->file('image')->store('task/' .Str::random(), 'public');
        }

        $task->update($data);
        
        return to_route('task.index')->with('success', "Task \"$task->name\" was updated");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(task $task)
    {
        $project = Project::with('group.users')->findOrFail($task->project_id);
        $this->authorizeProjectOwner($task, $project, true);
        
        $name = $task->name;

        if($task->image_path) {
            Storage::disk('public')->deleteDirectory(dirname($task->image_path));
        }

        $task->delete();
        return to_route('task.index')->with('success', "Task \"$name\" was deleted");
    }

    private function authorizeProjectOwner(Task $task, Project $project, $asOwner = false){
        $user = Auth::user();

        if (!$project->group_id) {
            if ($project->created_by !== $user->id) {
                abort(403, $asOwner
                    ? 'Only the project owner can perform this action.'
                    : 'You do not have access to this solo project.'
                );
            }
        } else {
            $group = $project->group;
            $isMember = $group->users()->where('user_id', $user->id)->exists();

            if (!$isMember) {
                abort(403, 'You are not a member of this group project');
            }

            if ($asOwner && $group->owner_id !== $user->id && $project->created_by !== $user->id) {
                abort(403, 'Only the group owner or project creator can perform this action');
            }
        }
    }

}
