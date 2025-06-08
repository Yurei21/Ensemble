import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import TextAreaInput from "@/Components/TextAreaInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react"
import SelectInput from "@/Components/SelectInput";

export default function Edit({group}) {
    const {data, setData, post, errors, reset} = useForm({
        image: "",
        name: group.name ||"",
        status: group.status || "",
        description: group.description || "",
        due_date: group.due_date ||"",
        _method: "PUT",
    })

    const onSubmit = (e) => {
        e.preventDefault()
        
        post(route('group.update', group.id))
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-3xl font-semibold leading-tight text-gray-800 dark:text-gray-200 text-center">
                    Edit Group "{group.name}"
                </h2>
            }
        >
            <Head title={`Edit Group "${group.name}"`} />
            
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        {group.image_path && <div>
                            <img src={group.image_path} className="w-full h-80 object-cover"/>    
                        </div>}
                        <form onSubmit={onSubmit}className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                            <div>
                                <InputLabel htmlFor="group_image_path" value="Group Image" />
                                <TextInput id="group_image_path" type="file" name="image" className="mt-1 block w-full" isFocused={true} onChange={e => setData('image', e.target.files[0])}/>
                                <InputError message={errors.image} className="mt-2"/>
                            </div>
                            <div className="mt-4">
                                <InputLabel htmlFor="group_name" value="Group Name" />
                                <TextInput id="group_name" type="text" name="text" value={data.name} className="mt-1 block w-full" isFocused={true} onChange={e => setData('name', e.target.value)}/>
                                <InputError message={errors.name} className="mt-2"/>
                            </div>
                            <div className="mt-4">
                                <InputLabel htmlFor="group_description" value="Group Description" />
                                <TextAreaInput id="group_description" name="text" value={data.description} className="mt-1 block w-full" isFocused={true} onChange={e => setData('description', e.target.value)}/>
                                <InputError message={errors.description} className="mt-2"/>
                            </div>
                            <div className="mt-4">
                                <InputLabel htmlFor="group_due_date" value="Group Deadline" />
                                <TextInput id="group_due_date" type="date" name="due_date" value={data.due_date} className="mt-1 block w-full" isFocused={true} onChange={e => setData('due_date', e.target.value)}/>
                                <InputError message={errors.due_date} className="mt-2"/>
                            </div>
                            <div className="mt-4">
                                <InputLabel htmlFor="group_status" value="Group Status" />
                                <SelectInput name="status" id="group_status" value={data.status} className="mt-1 block w-full" onChange={e => setData('status', e.target.value)}> 
                                    <option value="">Select Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                </SelectInput>
                                <InputError message={errors.status} className="mt-2"/>
                            </div>
                            <div className="mt-4 text-right">
                                <Link href={route('group.index')} className="bg-gray-100 px-3 py-1.5 text-gray-800 rounded shadow transition-all hover:bg-gray-200 mr-2">Cancel</Link>
                                <button className="bg-emerald-500 px-3 py-1 text-white rounded shadow transition-all hover:bg-emerald-600">Enter</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}