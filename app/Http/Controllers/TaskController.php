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
        $query = Task::where('created_by', Auth::id());

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
        $project = Project::with(['group.users', 'owner'])->findOrFail(request('project_id'));

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
        $this->authorizeTaskOwner($task);
        
        $query = $task->tasks();
        $sortField = request("sort_field", "created_at");
        $sortDirection = request("sort_direction", "desc");

        if (request("name")) {
            $query->where("name", "like", "%". request("name"). "%");;
        }

        if(request("status")) {
            $query->where("status", request("status"));
        }

        $tasks = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);
        return inertia('Task/Show', [
            'task'=> new TaskResource($task),
            'tasks' => TaskResource::collection($tasks),
            'queryParams' => request()->query() ?: null,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(task $task)
    {
        return inertia('Task/Edit', [
            'task' => new TaskResource($task),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatetaskRequest $request, task $task)
    {
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
        $name = $task->name;

        if($task->image_path) {
            Storage::disk('public')->deleteDirectory(dirname($task->image_path));
        }

        $task->delete();
        return to_route('task.index')->with('success', "Task \"$name\" was deleted");
    }

    private function authorizeTaskOwner(Task $task){
        if ($task->created_by !== Auth::id()) {
            abort(403, 'Unauthorized Access');
        }
    }
}
