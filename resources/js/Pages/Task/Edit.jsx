import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import TextAreaInput from "@/Components/TextAreaInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react"
import SelectInput from "@/Components/SelectInput";

export default function Edit({task, project, assignableUsers}) {
    console.log(task)
    const {data, setData, post, errors, reset} = useForm({
        image: "",
        name: task.name ||"",
        status: task.status || "",
        description: task.description || "",
        due_date: task.due_date ||"",
        project_id: project.id,
        assigned_user_id: '',
        _method: "PUT",
    })

    console.log(data)

    const onSubmit = (e) => {
        e.preventDefault()
        
        post(route('task.update', task.id))
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-3xl font-semibold leading-tight text-gray-800 dark:text-gray-200 text-center">
                    Edit Task "{task.name}"
                </h2>
            }
        >
            <Head title={`Edit Task "${task.name}"`} />
            
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        {task.image_path && <div>
                            <img src={task.image_path} className="w-full h-80 object-cover"/>    
                        </div>}
                        <form onSubmit={onSubmit}className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                            <div>
                                <InputLabel htmlFor="task_image_path" value="Task Image" />
                                <TextInput id="task_image_path" type="file" name="image" className="mt-1 block w-full" isFocused={true} onChange={e => setData('image', e.target.files[0])}/>
                                <InputError message={errors.image} className="mt-2"/>
                            </div>
                            <div className="mt-4">
                                <InputLabel htmlFor="task_name" value="Task Name" />
                                <TextInput id="task_name" type="text" name="text" value={data.name} className="mt-1 block w-full" isFocused={true} onChange={e => setData('name', e.target.value)}/>
                                <InputError message={errors.name} className="mt-2"/>
                            </div>
                            <div className="mt-4">
                                <InputLabel htmlFor="task_description" value="Task Description" />
                                <TextAreaInput id="task_description" name="text" value={data.description} className="mt-1 block     w-full" isFocused={true} onChange={e => setData('description', e.target.value)}/>
                                <InputError message={errors.description} className="mt-2"/>
                            </div>
                            <div className="mt-4">
                                <InputLabel htmlFor="task_due_date" value="Task Deadline" />
                                <TextInput id="task_due_date" type="date" name="due_date" value={data.due_date} className="mt-1 block w-full" isFocused={true} onChange={e => setData('due_date', e.target.value)}/>
                                <InputError message={errors.due_date} className="mt-2"/>
                            </div>
                            <div className="mt-4">
                                <InputLabel htmlFor="task_status" value="Task Status" />
                                <SelectInput name="status" id="task_status" value={data.status} className="mt-1 block w-full" onChange={e => setData('status', e.target.value)}> 
                                    <option value="">Select Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                </SelectInput>
                                <InputError message={errors.status} className="mt-2"/>
                            </div>
                            <div className="mt-4">
                                <InputLabel htmlFor="task_priority" value="Task Priority" />
                                <SelectInput name="priority" id="task_priority" value={data.priority} className="mt-1 block w-full" onChange={e => setData('priority', e.target.value)}> 
                                    <option value="">Select Priority</option>
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </SelectInput>
                                <InputError message={errors.priority} className="mt-2"/>
                            </div>
                            <div className="mt-4">
                                <InputLabel htmlFor="assigned_user_id" value="Assign User" />
                                    <SelectInput name="Assigned" id="assigned_user_id" value={data.assigned_user_id} className="mt-1 block w-full" onChange={e => setData('assigned_user_id', e.target.value)}> 
                                        <option value="">Select User</option>
                                        {assignableUsers.data && assignableUsers.data.map(user => (
                                            <option key={user.id} value={user.id}>{user.name}</option>
                                        ))}
                                    </SelectInput>
                                <InputError message={errors.assigned_user_id} className="mt-2"/>
                            </div>
                            <div className="mt-4">
                            <InputLabel htmlFor="project_name" value="Project" />
                                <TextInput
                                    id="project_name"
                                    type="text"
                                    value={project.name}
                                    className="mt-1 block w-full"
                                    disabled
                                />
                                <InputError message={errors.project_id} className="mt-2"/>
                            </div>
                            <div className="mt-4 text-right">
                                <Link href={route('task.index')} className="bg-gray-100 px-3 py-1.5 text-gray-800 rounded shadow transition-all hover:bg-gray-200 mr-2">Cancel</Link>
                                <button className="bg-emerald-500 px-3 py-1 text-white rounded shadow transition-all hover:bg-emerald-600">Enter</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}