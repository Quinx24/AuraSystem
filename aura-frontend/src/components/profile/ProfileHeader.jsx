import { User } from "lucide-react";

export default function ProfileHeader() {

    return (

        <div className="flex items-center gap-3">

            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-violet-600 text-white shadow-lg shadow-violet-200">
                <User size={24} />
            </div>

            <div>

                <h1 className="text-3xl font-bold text-slate-900 md:text-4xl xl:text-5xl">
                    My Profile
                </h1>

                <p className="mt-1 text-base text-gray-500 md:text-lg">
                    Track your emotional journey and personal growth
                </p>

            </div>

        </div>

    );

}
