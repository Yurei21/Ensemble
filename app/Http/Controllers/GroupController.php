<?php

namespace App\Http\Controllers;

use App\Http\Resources\GroupResource;
use App\Http\Resources\UserResource;
use App\Models\Group;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreGroupRequest;
use App\Http\Requests\UpdateGroupRequest;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
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
        $memberIds = $data['group_members'];
        $memberIds[] = Auth::id();

        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('group/' .Str::random(), 'public');
        }

        $group = Group::create($data);
        if (!empty($data['group_members'])) {
            $group->users()->attach($data['group_members']);
        }
        $group->users()->attach(array_unique($memberIds));

        return to_route('group.index')->with('success', 'Group was created');
    }

    /**
     * Display the specified resource.
     */
    public function show(Group $group)
    {
        $query = $group->users();
        $sortField = request("sort_field", "name");
        $sortDirection = request("sort_direction", "desc");

        if (request("name")) {
            $query->where("name", "like", "%" .request("name") . "%");
        }
        

        $members = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);
        return inertia('Group/Show', [
            'group' => new GroupResource($group),
            'members' => UserResource::collection($members),
            'queryParams' => request()->query() ?: null,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Group $group)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateGroupRequest $request, Group $group)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Group $group)
    {
        $group;
    }
}
