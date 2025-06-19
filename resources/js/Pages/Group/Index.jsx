import Pagination from "@/Components/Pagination";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/16/solid';
import { useEffect, useState } from "react";

export default function Index({groups, queryParams = null, success}) {
    queryParams = queryParams || {}

    console.log(groups);

    const [showSuccess, setShowSuccess] = useState(!!success)

    useEffect(() => {
        if(showSuccess) {
            const timer = setTimeout(() => {
                setShowSuccess(false)
            }, 3000)

            return () => clearTimeout(timer)
        }
    }, [showSuccess])

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
        if(!window.confirm('Are you sure you want to delete the group?')) {
            return
        }
        
        router.visit(route('group.destroy', group.id), {
            method: 'delete',
            preserveScroll: true,
            preserveState: false,
        });
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-semibold leading-tight text-gray-800 dark:text-gray-200 ">
                        Groups
                    </h2>
                    <Link
                        href={route("group.create")}
                        className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600"                
                    >Add New</Link>
                </div>
            }
        >
            <Head title="Groups" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {showSuccess && success && (<div className="bg-emerald-500 px-4 py-2 text-white rounded mb-3">{success}</div>)}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                                <div className="overflow-auto">
                                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                                <tr className="">
                                                    <th onClick={e => sortChanged('id')} className="px-3 py-2 cursor-pointer"> <div className="flex items-center justify-between">ID<div><ChevronUpIcon className="w-4" /><ChevronDownIcon className="w-4 -mt-2" /></div></div></th>
                                                    <th onClick={e => sortChanged('name')} className="px-3 py-2 cursor-pointer"><div className="flex items-center justify-between">Name<div><ChevronUpIcon className="w-4" /><ChevronDownIcon className="w-4 -mt-2" /></div></div></th>
                                                    <th onClick={e => sortChanged('status')} className="px-3 py-2 cursor-pointer"><div className="flex items-center justify-between">Owner<div><ChevronUpIcon className="w-4" /><ChevronDownIcon className="w-4 -mt-2" /></div></div></th>
                                                    <th onClick={e => sortChanged('created_at')} className="px-3 py-2 cursor-pointer"><div className="flex items-center justify-between">Created Date<div><ChevronUpIcon className="w-4" /><ChevronDownIcon className="w-4 -mt-2" /></div></div></th>
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
                                                    placeholder="Group Name"
                                                    onBlur={e => searchFieldChanged('name', e.target.value)}
                                                    onKeyPress={e => onKeyPress('name', e)}
                                                    />
                                                </th>
                                                <th className="px-3 py-2"></th>
                                                <th className="px-3 py-2"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {groups.data.map(group => (
                                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={group.id}>
                                                    <td className="px-3 py-2">{group.id}</td>
                                                    <th className="px-3 py-2 text-gray-100 hover:underline">
                                                        <Link href={route("group.show", group.id)}>{group.name}</Link>
                                                    </th>
                                                    <td className="px-3 py-2">
                                                        {group.owner.name}
                                                    </td>
                                                    <td className="px-3 py-2">{group.created_at}</td>
                                                    <td className="px-3 py-2 text-nowrap">
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
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}