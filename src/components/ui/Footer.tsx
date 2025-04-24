export function Footer() {
  return (
    <footer className="mt-12 w-full bg-gray-100 py-6 px-4 text-sm text-gray-600">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 sm:flex-row">
        <p>&copy; {new Date().getFullYear()} Xroll. All rights reserved.</p>
        <div>
          <a href="/policy" className="hover:underline">
            プライバシーポリシー
          </a>
          <div>お問い合わせ：xroll.net@gmail.com</div>
        </div>
      </div>
    </footer>
  );
}
