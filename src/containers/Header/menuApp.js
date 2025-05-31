export const adminMenu = [
  {
    //Quản lý người dùng

    name: "menu.admin.manage-user",
    menus: [
      {
        name: "menu.admin.crud",
        link: "/system/user-manage",
      },
      {
        name: "menu.admin.crud-redux",
        link: "/system/user-redux",
      },
      {
        name: "menu.admin.manage-doctor",
        link: "/system/manage-doctor",
      },
      // {
      //   name: "menu.admin.manage-admin",
      //   link: "/system/user-admin",
      // },

      {
        //Quản lý kế hoạch khám bệnh của bác sĩ
        name: "menu.doctor.manage-schedule",
        link: "/doctor/manage-schedule",
      },
    ],
  },
  {
    //Quản lý phòng khám
    name: "menu.admin.clinic",
    menus: [
      {
        name: "menu.admin.manage-clinic",
        link: "/system/manage-clinic",
      },
      {
        name: "menu.admin.manage-infor-clinic",
        link: "/system/manage-infor-clinic",
      },
    ],
  },
  {
    //Quản lý chuyên khoa
    name: "menu.admin.specialty",
    menus: [
      {
        name: "menu.admin.manage-specialty",
        link: "/system/manage-specialty",
      },
      {
        name: "menu.admin.manage-infor-specialty",
        link: "/system/manage-infor-specialty",
      },
    ],
  },
  {
    //Quản lý cẩm nang
    name: "menu.admin.handbook",
    menus: [
      {
        name: "menu.admin.manage-handbook",
        link: "/system/manage-handbook",
      },
      {
        name: "menu.admin.manage-infor-handbook",
        link: "/system/manage-infor-handbook",
      },
    ],
  },
  {
    //Quản lý About
    name: "admin.manage-about.about",
    menus: [
      {
        name: "menu.admin.manage-about",
        link: "/system/manage-about",
      },
    ],
  },
];
export const doctorMenu = [
  {
    name: "menu.admin.manage-user",
    menus: [
      {
        //Quản lý kế hoạch khám bệnh của bác sĩ
        name: "menu.doctor.manage-schedule",
        link: "/doctor/manage-schedule",
      },
      {
        //Quản lý bệnh nhân của bác sĩ
        name: "menu.doctor.manage-patient",
        link: "/doctor/manage-patient",
      },
    ],
  },
];
