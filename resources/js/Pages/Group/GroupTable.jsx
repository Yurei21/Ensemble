import Pagination from "@/Components/Pagination";
import SelectInput from "@/Components/SelectInput";
import TextInput from "@/Components/TextInput";
import { Link, router } from "@inertiajs/react";
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/16/solid';

export default function GroupsTable({ groups, queryParams = null }) {
    queryParams = queryParams || {}
    const searchFieldChanged = (name, value) => {
        if(value) {
            queryParams[name] = value
        } else {
            delete queryParams[name]
        }

        router.get(route('group.index'), queryParams)
    }

    const onKeyPress = (name, e) => {
        if (e.key !== 'Enter') return;

        searchFieldChanged(name, e.target.value);
    }

    const sortChanged = (name) => {
        if (name === queryParams.sort_field) {
            if (queryParams.sort_direction === "asc") {
                queryParams.sort_direction = "desc"
            } else {
                queryParams.sort_direction = "asc"
            }
        } else {
            queryParams.sort_field = name;
            queryParams.sort_direction = 'asc'
        }

        router.get(route('group.index'), queryParams)
    }

    const deleteGroup = (group) => {
        if(!window.confirm('Are you sure you want to delete the project?')) {
            return
        }
        
        router.visit(route('group.destroy', group.id), {
            method: 'delete',
            preserveScroll: true,
            preserveState: false,
        });
    }

    return (
        <>
            <div className="overflow-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                        <tr className="text-nowrap">
                            <th onClick={e => sortChanged('id')} className="px-3 py-2 cursor-pointer"> <div className="flex items-center justify-between">ID<div><ChevronUpIcon className="w-4" /><ChevronDownIcon className="w-4 -mt-2" /></div></div></th>
                            <th onClick={e => sortChanged('')} className="px-3 py-2">Image</th>
                            <th onClick={e => sortChanged('')} className="px-3 py-2">Project Name</th>
                            <th onClick={e => sortChanged('name')} className="px-3 py-2 cursor-pointer"><div className="flex items-center justify-between">Name<div><ChevronUpIcon className="w-4" /><ChevronDownIcon className="w-4 -mt-2" /></div></div></th>
                            <th onClick={e => sortChanged('status')} className="px-3 py-2 cursor-pointer"><div className="flex items-center justify-between">Status<div><ChevronUpIcon className="w-4" /><ChevronDownIcon className="w-4 -mt-2" /></div></div></th>
                            <th onClick={e => sortChanged('created_at')} className="px-3 py-2 cursor-pointer"><div className="flex items-center justify-between">Created Date<div><ChevronUpIcon className="w-4" /><ChevronDownIcon className="w-4 -mt-2" /></div></div></th>
                            <th onClick={e => sortChanged('due_date')} className="px-3 py-2 cursor-pointer"><div className="flex items-center justify-between">Due Date<div><ChevronUpIcon className="w-4" /><ChevronDownIcon className="w-4 -mt-2" /></div></div></th>
                            <th onClick={e => sortChanged('')} className="px-3 py-2">Created By</th>
                            <th onClick={e => sortChanged('')} className="px-3 py-2 text-right">Action</th>
                        </tr>
                    </thead>
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                        <tr className="text-nowrap">
                            <th className="px-3 py-2"></th>
                            <th className="px-3 py-2"></th>
                            <th className="px-3 py-2">
                                <TextInput
                                    className="w-full"
                                    defaultValue={queryParams.name}
                                    placeholder="Group Name"
                                    onBlur={e => searchFieldChanged('name', e.target.value)}
                                    onKeyPress={e => onKeyPress('name', e)}
                                />
                            </th>
                            <th className="px-3 py-2">
                                <SelectInput
                                    defaultValue={queryParams.status}
                                    onChange={e => searchFieldChanged('status', e.target.value)}
                                    className="w-full">
                                    <option value="">Select Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                </SelectInput>
                            </th>
                            <th className="px-3 py-2"></th>
                            <th className="px-3 py-2"></th>
                            <th className="px-3 py-2"></th>
                            <th className="px-3 py-2"></th>
                            <th className="px-3 py-2 "></th>
                        </tr>
                    </thead>
                    <tbody>
                        {groups.data.map(group => (
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={group.id}>
                                <td className="px-3 py-2">{group.id}</td>
                                <td className="px-3 py-2"><image src={group.image_path} alt="" style={{ width: 60 }} /></td>
                                <td className="px-3 py-2">{group.project.name}</td>
                                <th className="px-3 py-2 text-gray-100 hover:underline">
                                    <Link href={route("group.show", group.id)}>{group.name}</Link>
                                </th>
                                <td className="px-3 py-2">{group.created_at}</td>
                                <td className="px-3 py-2">{group.createdBy.name}</td>
                                <td className="px-3 py-2">
                                    <Link href={route('group.edit', group.id)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline mx-1">
                                        Edit
                                    </Link>
                                    <button onClick={e => deleteGroup(group)} className="font-medium text-red-600 dark:text-red-500 hover:underline mx-1">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination links={groups.meta.links}></Pagination>
        </>
    )
}