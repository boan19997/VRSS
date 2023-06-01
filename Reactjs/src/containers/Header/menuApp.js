export const adminMenu = [
    {
        name: 'menu.admin.manage-system',
        menus: [
            {
                name: 'menu.admin.manage-user', link: '/system/user-redux'
            },
            {
                name: 'menu.admin.manage-center', link: '/system/manage-center'
            },
            {
                name: 'menu.center.manage-schedule', link: '/center/manage-schdule'
            },
        ]
    },
];

export const centerMenu = [
    {
        name: 'menu.admin.manage-user',
        menus: [
            {
                name: 'menu.center.manage-schedule', link: '/center/manage-schdule'
            },
            {
                name: 'menu.center.manage-user', link: '/center/manage-user'
            },
        ]
    }
];