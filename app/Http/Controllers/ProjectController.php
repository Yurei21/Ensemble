<?php

namespace App\Http\Controllers;

use App\Http\Resources\TaskResource;
use App\Models\Project;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Models\Group;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();

        $query = Project::query()->where(function ($q) use ($user) {
            $q->where('created_by', $user->id)->orWhereHas('group.users', function ($q2) use ($user) {
                $q2->where('user_id', $user->id);
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

        $projects = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);
         
        return inertia("Project/Index", [
            'projects' => ProjectResource::collection($projects),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user = Auth::user();
        $groups = Group::where('owner_id', $user)->get();
        return inertia("Project/Create", ['groups' => $groups]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProjectRequest $request)
    {
        $data = $request->validated();
        $data['created_by'] = Auth::id();
        $data['updated_by'] = Auth::id();

        if($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('project/' .Str::random(), 'public');
        }

        Project::create($data);

        return to_route('project.index')->with('success', 'Project was created');
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project)
    {
        $this->authorizeProjectOwner($project);
        
        $query = $project->tasks();
        $sortField = request("sort_field", "created_at");
        $sortDirection = request("sort_direction", "desc");

        if (request("name")) {
            $query->where("name", "like", "%". request("name"). "%");;
        }

        if(request("status")) {
            $query->where("status", request("status"));
        }

        $tasks = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);
        return inertia('Project/Show', [
            'project'=> new ProjectResource($project),
            'tasks' => TaskResource::collection($tasks),
            'queryParams' => request()->query() ?: null,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project)
    {
        $this->authorizeProjectOwner($project, true);

        return inertia('Project/Edit', [
            'project' => new ProjectResource($project),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProjectRequest $request, Project $project)
    {
        $this->authorizeProjectOwner($project, true);

        $data = $request->validated();
        $project->update($data);
        $data['updated_by'] = Auth::id();

        if($request->hasFile('image')) {
            if ($project->image_path) {
                Storage::disk('public')->deleteDirectory(dirname($project->image_path));
            }
            $data['image_path'] = $request->file('image')->store('project/' .Str::random(), 'public');
        }

        $project->update($data);
        
        return to_route('project.index')->with('success', "Project \"$project->name\" was updated");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        $this->authorizeProjectOwner($project, true);

        $name = $project->name;

        if($project->image_path) {
            Storage::disk('public')->deleteDirectory(dirname($project->image_path));
        }

        $project->delete();
        return to_route('project.index')->with('success', "Project \"$name\" was deleted");
    }

    private function authorizeProjectOwner(Project $project, $asOwner = false){
        $user = Auth::user();
        
        if (!$project->group_id) {
            if($asOwner && $project->created_by !== $user->id) {
                abort(403, 'Only the owner can perform this action.');
            }
            
            if (!$asOwner && $project->created_by !== $user->id) {
                abort(403, 'You do not have access to this solo project.');
            }
        }

        if($project->group_id) {
            $isMember = $project->group->users()->where('user_id', $user->id)->exists();

            if (!$isMember) {
                abort(403, 'you are not a member of this project');
            }

            if ($asOwner && $project->group->owner_id !== $user->id && $project->created_by !== $user->id) {
                abort(403, 'Only the project creatorr can perform this action.');
            }
        }
    }
}
