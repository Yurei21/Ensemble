import Pagination from "@/Components/Pagination";
import SelectInput from "@/Components/SelectInput";
import TextInput from "@/Components/TextInput";
import { PROJECT_STATUS_CLASS_MAP, PROJECT_STATUS_TEXT_MAP } from "@/constants.js";
import { Link, router } from "@inertiajs/react";
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/16/solid';

export default function ProjectTable({ projects, queryParams = null }) {
    queryParams = queryParams || {}
    const searchFieldChanged = (name, value) => {
        if (value) {
            queryParams[name] = value
        } else {
            delete queryParams[name]
        }

        router.get(route('project.show'), queryParams)
    }

    const onKeyPress = (name, e) => {
        if (e.key !== 'Enter') return;

        searchFieldChanged(name, e.target.value);
    }
    const deleteProject = (project) => {
        if (!window.confirm('Are you sure you want to delete the project?')) {
            return
        }

        router.visit(route('project.destroy', project.id), {
            method: 'delete',
            preserveScroll: true,
            preserveState: false,
        });
    }

    return (
        <>
            <div className="overflow-auto">
                <h1 className="text-xl font-bold mb-3">Projects</h1>
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                        <tr className="">
                            <th onClick={e => sortChanged('id')} className="px-3 py-2 cursor-pointer"> <div className="flex items-center justify-between">ID<div><ChevronUpIcon className="w-4" /><ChevronDownIcon className="w-4 -mt-2" /></div></div></th>
                            <th onClick={e => sortChanged('')} className="px-3 py-2">Image</th>
                            <th onClick={e => sortChanged('name')} className="px-3 py-2 cursor-pointer"><div className="flex items-center justify-between">Name<div><ChevronUpIcon className="w-4" /><ChevronDownIcon className="w-4 -mt-2" /></div></div></th>
                            <th onClick={e => sortChanged('status')} className="px-3 py-2 cursor-pointer"><div className="flex items-center justify-between">Status<div><ChevronUpIcon className="w-4" /><ChevronDownIcon className="w-4 -mt-2" /></div></div></th>
                            <th onClick={e => sortChanged('created_at')} className="px-3 py-2 cursor-pointer"><div className="flex items-center justify-between">Created Date<div><ChevronUpIcon className="w-4" /><ChevronDownIcon className="w-4 -mt-2" /></div></div></th>
                            <th onClick={e => sortChanged('due_date')} className="px-3 py-2 cursor-pointer"><div className="flex items-center justify-between">Due Date<div><ChevronUpIcon className="w-4" /><ChevronDownIcon className="w-4 -mt-2" /></div></div></th>
                            <th onClick={e => sortChanged('')} className="px-3 py-2">Created By</th>
                            <th onClick={e => sortChanged('')} className="px-3 py-2 text-right">Action</th>
                        </tr>
                    </thead>
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                        <tr className="">
                            <th className="px-3 py-2"></th>
                            <th className="px-3 py-2"></th>
                            <th className="px-3 py-2">
                                <TextInput
                                    className="w-full"
                                    defaultValue={queryParams.name}
                                    placeholder="Project Name"
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
                            <th className="px-3 py-2 "></th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.data.map(project => (
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={project.id}>
                                <td className="px-3 py-2">{project.id}</td>
                                <td className="px-3 py-2"><img src={project.image_path} alt="" style={{ width: 60 }} /></td>
                                <th className="px-3 py-2 dark:text-white text-white text-nowrap hover:underline">
                                    <Link href={route('project.show', project.id)}>
                                        {project.name}
                                    </Link>
                                </th>
                                <td className="px-3 py-2">
                                    <span className={"px-2 py-1 rounded text-white " + PROJECT_STATUS_CLASS_MAP[project.status]}>
                                        {PROJECT_STATUS_TEXT_MAP[project.status]}
                                    </span>
                                </td>
                                <td className="px-3 py-2">{project.created_at}</td>
                                <td className="px-3 py-2 text-nowrap">{project.due_date}</td>
                                <td className="px-3 py-2">{project.createdBy.name}</td>
                                <td className="px-3 py-2 text-nowrap">
                                    <Link href={route('project.edit', project.id)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline mx-1">
                                        Edit
                                    </Link>
                                    <button onClick={e => deleteProject(project)} className="font-medium text-red-600 dark:text-red-500 hover:underline mx-1">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination links={projects.meta.links}></Pagination>
        </>
    )
}