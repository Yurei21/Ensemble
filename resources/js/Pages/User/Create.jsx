import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react"

export default function Create() {
    const {data, setData, post, processing, errors, reset} = useForm({
        image: '',
        name: '',
        email: '',
        created_at: '',
    })

    const onSubmit = (e) => {
        e.preventDefault()
        
        post(route('user.store'))
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-3xl font-semibold leading-tight text-gray-800 dark:text-gray-200 text-center">
                    Create User
                </h2>
            }
        >
            <Head title="Create a user" />
            
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <form onSubmit={onSubmit}className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                            <div>
                                <InputLabel htmlFor="user_image_path" value="User Image" />
                                <TextInput id="user_image_path" type="file" name="image" className="mt-1 block w-full" isFocused={true} onChange={e => setData('image', e.target.files[0])}/>
                                <InputError message={errors.image} className="mt-2"/>
                            </div>
                            <div className="mt-4">
                                <InputLabel htmlFor="user_name" value="User Name" />
                                <TextInput id="user_name" type="text" name="text" value={data.name} className="mt-1 block w-full" isFocused={true} onChange={e => setData('name', e.target.value)}/>
                                <InputError message={errors.name} className="mt-2"/>
                            </div>
                            <div className="mt-4">
                                <InputLabel htmlFor="user_email" value="User Email" />
                                <TextInput id="user_email" type="text" name="text" value={data.email} className="mt-1 block w-full" isFocused={true} onChange={e => setData('email', e.target.value)}/>
                                <InputError message={errors.name} className="mt-2"/>
                            </div>
                            <div className="mt-4 text-right">
                                <Link href={route('user.index')} className="bg-gray-100 px-3 py-1.5 text-gray-800 rounded shadow transition-all hover:bg-gray-200 mr-2">Cancel</Link>
                                <button className="bg-emerald-500 px-3 py-1 text-white rounded shadow transition-all hover:bg-emerald-600">Enter</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}