<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Project;
use App\Models\Task;


class DashboardController extends Controller
{
    public function index () {
        /**
         * @var \App\Models\User $user
         */
        $user = Auth::user();

        $projects = $user->projects()->withCount('tasks')->latest()->take(5)->get();

        $upcomingTasks = $user->assignedTasks()->where('status', '!=', 'completed')->orderBy('due_date')->take(5)->get();

        $groups = $user->groups()->withCount('projects', 'users')->get();

        return inertia('dashboard', [
            'projects' => $projects,
            'upcomingTasks' => $upcomingTasks,
            'groups' => $groups,
        ]);
    }
}
