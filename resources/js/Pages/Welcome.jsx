import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Welcome" />
            <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-gray-200 flex flex-col">

                <header className="container mx-auto flex justify-between items-center py-8 px-6 lg:px-0 relative z-10">
                    <div className="flex items-center space-x-3">
                        {/* Logo Icon (small logo if needed separately) */}
                        <img
                            className="h-20 w-20 object-contain"
                            src="/ensemble.png"
                            alt="Ensemble Logo"
                        />
                        <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400 select-none">
                            {/* Changed from red to blue */}
                            Ensemble
                        </h1>
                    </div>

                    <nav className="flex items-center space-x-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="px-4 py-2 mr-4 rounded-md bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                {/* Changed from red to blue */}
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="px-4 py-2 rounded-md border border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 dark:hover:bg-blue-900 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
                                >
                                    {/* Changed from red to blue */}
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="px-4 py-2 rounded-md bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
                                >
                                    {/* Changed from red to blue */}
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </header>

                <main className="flex-grow container mx-auto flex flex-col justify-center items-center px-6 text-center max-w-xl relative z-10">
                    <h2 className="text-5xl font-extrabold mb-6 text-blue-700 dark:text-blue-400 leading-tight">
                        {/* Changed from red to blue */}
                        Welcome to Ensemble
                    </h2>
                    <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                        Your all-in-one project management tool to collaborate, track progress, and deliver results seamlessly.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 italic">
                        Please log in or register to get started.
                    </p>
                </main>

                <footer className="py-10 text-center text-sm text-gray-500 dark:text-gray-400 select-none relative z-10">
                    Made with ❤️ by lovelylori
                </footer>
            </div>
        </>
    );
}
