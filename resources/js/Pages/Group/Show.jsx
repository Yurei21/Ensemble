import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";    
import GroupTable from "../Group/GroupTable";
import ProjectTable from "../Group/ProjectTable";

export default function Show({group, members, projects, queryParams}) {
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
                                        <label className="font-bold text-lg">Created By</label>
                                        <p className="mt-1">{group.owner.name}</p>
                                    </div>
                                </div>
                                <div>   
                                    <div className="mt-4">
                                        <label className="font-bold text-lg">Created at</label>
                                        <p className="mt-1">{group.created_at}</p>
                                    </div>
                                        <div className="mt-4">
                                        <label className="font-bold text-lg">Updated By</label>
                                        <p className="mt-1">{group.updated_at}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="py-3">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <ProjectTable group={group} projects={projects} queryParams={queryParams}></ProjectTable>
                        </div>
                    </div>
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800 mt-5">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <GroupTable group={group} members={members} queryParams={queryParams}></GroupTable>
                        </div>
                    </div>
                </div>
            </div>

        </AuthenticatedLayout>
    )
}