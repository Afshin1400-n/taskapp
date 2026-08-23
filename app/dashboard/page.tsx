// src/app/dashboard/page.tsx

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* هدر */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">TaskFlow</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700 dark:text-gray-300">علی محمدی</span>
            <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition">
              خروج
            </button>
          </div>
        </div>
      </header>

      {/* محتوای اصلی */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* خوش‌آمدگویی */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">داشبورد</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">به TaskFlow خوش آمدید</p>
        </div>

        {/* کارت‌های آمار */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">تعداد پروژه‌ها</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">۰</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">تعداد تسک‌ها</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">۰</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">تسک‌های انجام شده</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">۰</p>
          </div>
        </div>

        {/* لیست پروژه‌ها */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">پروژه‌های اخیر</h3>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm">
              پروژه جدید
            </button>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            هنوز پروژه‌ای ایجاد نشده است
          </p>
        </div>
      </main>
    </div>
  );
}