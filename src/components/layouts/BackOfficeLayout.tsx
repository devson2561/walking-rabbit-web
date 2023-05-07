import { ArrowRight } from "iconoir-react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

const menuItems = [
  {
    title: "Beverages",
    path: "/admin/beverages",
  },
  {
    title: "Categories",
    path: "/admin/beverages",
  },
  {
    title: "Machines",
    path: "/admin/machines",
  },
];

export default function BackOfficeLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLogin");
    navigate("/auth/login");
  };

  return (
    <>
      <div>
        <div className="navbar bg-primary text-white flex flex-row items-center py-0 pl-20"></div>
        <div className="drawer drawer-mobile h-full bg-slate-50">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" />

          <div
            className="drawer-content "
            style={{
              scrollBehavior: "smooth",
              overflowY: "auto",
              height: "calc(100vh - 4rem)",
              maxHeight: "calc(100vh - 4rem)",
            }}
          >
            <Outlet />
          </div>
          <div
            className="drawer-side"
            style={{
              scrollBehavior: "smooth",
              height: "calc(100vh - 4rem)",
              maxHeight: "calc(100vh - 4rem)",
            }}
          >
            <label htmlFor="drawer" className="drawer-overlay"></label>
            <aside
              className="w-[30vw] max-w-[250px] flex flex-col pb-[30px]"
              style={{ background: "rgba(242, 242, 242, 0.698836)" }}
            >
              <ul className="menu menu-compact flex flex-col p-0 mb-10 flex-1">
                {menuItems.map((item, i) => {
                  const isActive = pathname === item.path;

                  return (
                    <li key={`menu-${i}`}>
                      <Link to={item.path} className="cursor-pointer">
                        <div className="flex items-center gap-4 py-2 px-2  w-full">
                          <span
                            className={`flex-1 text-[14px] ${
                              isActive ? "text-primary" : ""
                            }`}
                          >
                            {item.title}
                          </span>
                          <ArrowRight
                            className={`w-3 h-3 menu-icon ${
                              isActive ? "text-primary" : ""
                            }`}
                          />
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <div className="px-4">
                <button className="btn btn-sm w-full" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
