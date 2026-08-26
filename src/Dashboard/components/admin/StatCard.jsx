const StatCard = ({ title, value, icon, description }) => {
    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">
                        {title}
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-gray-900">
                        {value}
                    </h2>

                    {description && (
                        <p className="mt-2 text-xs text-gray-400">
                            {description}
                        </p>
                    )}
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-2xl text-red-600">
                    {icon}
                </div>
            </div>
        </div>
    );
};

export default StatCard;