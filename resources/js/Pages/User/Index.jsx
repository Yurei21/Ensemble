import Pagination from "@/Components/Pagination";
import SelectInput from "@/Components/SelectInput";
import TextInput from "@/Components/TextInput";
import { USER_STATUS_CLASS_MAP, USER_STATUS_TEXT_MAP } from "@/constants.js";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/16/solid';
import { useEffect, useState } from "react";

export default function Index({users, queryParams = null, success}) {
    queryParams = queryParams || {}

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

        router.get(route('user.index'), queryParams)
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

        router.get(route('user.index'), queryParams)
    }

    const deleteUser = (user) => {
        if(!window.confirm('Are you sure you want to delete the user?')) {
            return
        }
        
        router.visit(route('user.destroy', user.id), {
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
                        Users
                    </h2>
                    <Link
                        href={route("user.create")}
                        className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600"                
                    >Add New</Link>
                </div>
            }
        >
            <Head title="Users" />

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
                                                    <th onClick={e => sortChanged('status')} className="px-3 py-2 cursor-pointer"><div className="flex items-center justify-between">Email<div><ChevronUpIcon className="w-4" /><ChevronDownIcon className="w-4 -mt-2" /></div></div></th>
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
                                                    placeholder="User Name"
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
                                            {users.data.map(user => (
                                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={user.id}>
                                                    <td className="px-3 py-2">{user.id}</td>
                                                    <td className="px-3 py-2"><img src={user.image_path} alt="" style={{width:60}}/></td>
                                                    <th className="px-3 py-2 dark:text-white text-white text-nowrap hover:underline">
                                                        <Link href={route('user.show', user.id)}>
                                                            {user.name}
                                                        </Link>
                                                    </th>
                                                    <td className="px-3 py-2">
                                                        <span className={"px-2 py-1 rounded text-white " + USER_STATUS_CLASS_MAP[user.status]}>
                                                            {USER_STATUS_TEXT_MAP[user.status]}
                                                        </span>
                                                    </td>
                                                    <td className="px-3 py-2">{user.created_at}</td>
                                                    <td className="px-3 py-2 text-nowrap">{user.due_date}</td>
                                                    <td className="px-3 py-2">{user.createdBy.name}</td>
                                                    <td className="px-3 py-2 text-nowrap">
                                                        <Link href={route('user.edit', user.id)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline mx-1">
                                                            Edit
                                                        </Link>
                                                        <button onClick={e => deleteUser(user)} className="font-medium text-red-600 dark:text-red-500 hover:underline mx-1">
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            <Pagination links={users.meta.links}></Pagination>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}