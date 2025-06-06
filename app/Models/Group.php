<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    /** @use HasFactory<\Database\Factories\GroupFactory> */
    use HasFactory;

    public function users() {
        return $this->belongsTo(User::class, 'group_members');
    }

    public function members () {
        return $this->hasMany(GroupMembers::class);
    }

    public function projects() {
        return $this->hasMany(Project::class);
    }
}
