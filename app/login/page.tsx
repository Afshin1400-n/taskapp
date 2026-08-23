import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        {/* هدر */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">خوش آمدید</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">وارد حساب کاربری خود شوید</p>
        </div>

        {/* فرم */}
        <form className="space-y-6">
          {/* ایمیل */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ایمیل
            </label>
            <input
              type="email"
              placeholder="example@email.com"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>

          {/* رمز عبور */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              رمز عبور
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>

          {/* دکمه ورود */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200"
          >
            ورود
          </button>
        </form>

        {/* لینک ثبت‌نام */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          حساب کاربری ندارید؟{' '}
           <Link
            href="/register"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            ورود
          </Link>
        </p>
      </div>
    </div>
  );
}