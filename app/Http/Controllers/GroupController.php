<?php

namespace App\Http\Controllers;

use App\Http\Resources\GroupResource;
use App\Http\Resources\ProjectResource;
use App\Http\Resources\UserResource;
use App\Models\Group;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreGroupRequest;
use App\Http\Requests\UpdateGroupRequest;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;


class GroupController extends Controller
{
    /**
     * Display a listing of the resource.
     */
        public function index()
        {
            $query = Group::query();

            $sortField = request("sort_field", "created_at");
            $sortDirection = request("sort_direction", "desc");

            if (request("name")) {
                $query->where("name", "like", "%". request("name"). "%");;
            }

            if(request("status")) {
                $query->where("status", request("status"));
            }

            $projects = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);
            
            return inertia("Group/Index", [
                'groups' => GroupResource::collection($projects),
                'queryParams' => request()->query() ?: null,
                'success' => session('success'),
            ]);
        }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $users = User::query()->orderBy('name', 'asc')->get();
        return inertia("Group/Create",[
            'users' => UserResource::collection($users)
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreGroupRequest $request)
    {
        $data = $request->validated();
        $data['owner_id'] = Auth::id(); 

        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('group/' .Str::random(), 'public');
        }

        $group = Group::create($data);

        $memberIds = array_unique([...$data['group_members'], Auth::id()]);
        $group->users()->attach($memberIds);

        return to_route('group.index')->with('success', 'Group was created');
    }

    /**
     * Display the specified resource.
     */
    public function show(Group $group)
    {
        $memberQuery = $group->users();
        $sortField = request("sort_field", "name");
        $sortDirection = request("sort_direction", "desc");

        if (request("name")) {
            $memberQuery->where("name", "like", "%" .request("name") . "%");
        }

        $members = $memberQuery->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);

        $projectQuery = $group->projects();
        
        if (request("name")) {
            $projectQuery->where("name", "like", "%" .request("name") . "%");
        }

        $project = $projectQuery->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);

        return inertia('Group/Show', [
            'group' => new GroupResource($group),
            'projects' => ProjectResource::collection($project),
            'members' => UserResource::collection($members),
            'queryParams' => request()->query() ?: null,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Group $group)
    {
        $this->authorizeOwner($group);
        $users = User::query()->orderBy('name', 'asc')->get();

        $group->load('users');

        return inertia('Group/Edit' , [
            'group' => new GroupResource($group),
            'users' => UserResource::collection($users)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateGroupRequest $request, Group $group)
    {
        $this->authorizeOwner($group);

        $data = $request->validated();

        if($request->hasFile('image')) {
            if($group->image_path) {
                Storage::disk('public')->deleteDirectory(dirname($group->image_path));
            }
            $data['image_path'] = $request->file('image')->store('group/' .Str::random(), 'public');
        }

        $group->update($data);

        return to_route('group.index')->with('success', "Group \"$group->name\" was updated");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Group $group)
    {
        $this->authorizeOwner($group);

        $group->users()->detach();

        if ($group->image_path) {
            Storage::disk('public')->deleteDirectory(dirname($group->image_path));
        }
        
        $group->delete();

        return to_route('group.index')->with('success', 'Group Was Deleted');
    }

    public function removeMember(Group $group, User $user)
    {
        if ($group->owner_id === $user->id) {
            return back()->with('error', 'You cannot remove the group owner.');
        }

        $group->users()->detach($user->id);

        return back()->with('success', 'Member removed from the group.');
    }

    private function authorizeOwner(Group $group)
    {
        if (Auth::id() !== $group->owner_id) {
            abort(403, 'Unauthorized action. Only the group owner can do this');
        }   
    }
}
