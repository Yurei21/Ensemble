<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    /** @use HasFactory<\Database\Factories\GroupFactory> */
    use HasFactory;

    protected $fillable = ['name', 'image_path', 'owner_id'];

    public function owner() {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function users() {
        return $this->belongsToMany(User::class, 'group_members');
    }

    public function group () {
        return $this->belongsToMany(Group::class, 'group_members');
    }

    public function projects() {
        return $this->hasMany(Project::class);
    }
}
