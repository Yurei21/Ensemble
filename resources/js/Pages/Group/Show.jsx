import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import TasksTable from "../Task/TasksTable";

export default function Show({group, tasks, queryParams}) {
    queryParams = queryParams || {}
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    {`Group "${group.name}"`}
                </h2>
            }
        >
            <Head title={`Group "${group.name}"`} />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div>
                            <img 
                                src={group.image_path}
                                alt=""
                                className="w-full h-80 object-cover"
                            />
                        </div>
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="grid gap-1 grid-cols-2 mt-2">
                                <div>
                                    <div>
                                        <label className="font-bold text-lg">Group ID</label>
                                        <p className="mt-1">{group.id}</p>
                                    </div>
                                    <div className="mt-4">
                                        <label className="font-bold text-lg">Group Name</label>
                                        <p className="mt-1">{group.name}</p>
                                    </div>
                                    <div className="mt-4">
                                        <label className="font-bold text-lg">Group Status</label>
                                        <p className="mt-1">
                                            {group.email}
                                        </p>
                                    </div>
                                    <div className="mt-4">
                                        <label className="font-bold text-lg">Created By</label>
                                        <p className="mt-1">{group.createdBy.name}</p>
                                    </div>
                                </div>
                                <div>
                                    <div className="mt-4">
                                        <label className="font-bold text-lg">Due Date</label>
                                        <p className="mt-1">{group.due_date}</p>
                                    </div>
                                    <div className="mt-4">
                                        <label className="font-bold text-lg">Created at</label>
                                        <p className="mt-1">{group.created_at}</p>
                                    </div>
                                        <div className="mt-4">
                                        <label className="font-bold text-lg">Updated By</label>
                                        <p className="mt-1">{group.updatedBy.name}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="font-bold text-lg">Group Description</label>
                                <p className="mt-1">{group.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <TasksTable tasks={tasks} queryParams={queryParams}></TasksTable>
                        </div>
                    </div>
                </div>
            </div>

        </AuthenticatedLayout>
    )
}