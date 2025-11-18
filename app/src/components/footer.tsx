import { Facebook, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-16">
      <div className="max-w-[1280px] mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-10 text-gray-500">
        <div>
          <h2 className="text-2xl font-bold text-green-600 mb-3">Eventify</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Nền tảng mua vé sự kiện hàng đầu giúp bạn dễ dàng tìm kiếm, đặt vé
            và tham gia những sự kiện yêu thích một cách nhanh chóng và an toàn.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Hỗ trợ</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="#"
                className="hover:text-green-600 transition-colors duration-200"
              >
                Trung tâm trợ giúp
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-green-600 transition-colors duration-200"
              >
                Điều khoản & Chính sách
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-green-600 transition-colors duration-200"
              >
                Liên hệ
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-800">
            Kết nối với chúng tôi
          </h3>
          <div className="flex gap-4">
            {[
              {
                href: "#",
                icon: <Linkedin />,
              },
              {
                href: "#",
                icon: <Facebook />,
              },
              {
                href: "#",
                icon: <Twitter />,
              },
            ].map(({ href, icon }, i) => (
              <a
                key={i}
                href={href}
                className="text-gray-500 hover:text-green-600 transition-colors duration-200"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 text-center py-4 text-sm text-gray-500">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold">Eventify</span>. All rights reserved.
      </div>
    </footer>
  );
}
