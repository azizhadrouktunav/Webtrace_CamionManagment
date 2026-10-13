import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id: 'dashboards',
        title: 'Dashboard',
        type: 'item',
        icon: 'dashboard',
        url: 'dashboard'
    },
    {
        id: 'monitoring',
        title: 'Suivi',
        type: 'item',
        icon: 'public',
        url: 'Home'
    },
    {
        id: 'Parc',
        title: 'Parc',
        type: 'collapsable',
        icon: 'local_parking',
        children: [
            {
                id: 'missions',
                title: 'Gestion des missions',
                type: 'item',
                icon: 'list_alt',
                url: 'parc/missions'
            },
            {
                id: 'camions',
                title: 'Gestion de véhicules',
                type: 'item',
                icon: 'directions_car',
                url: 'parc/camions'
            },
            {
                id: 'chauffeurs',
                title: 'Gestion des chauffeurs',
                type: 'item',
                icon: 'airline_seat_recline_normal',
                url: 'parc/chauffeurs'
            },
            {
                id: 'navires',
                title: 'Gestion des navires',
                type: 'item',
                icon: 'directions_boat',
                url: 'parc/navires'
            }
        ]
    },
    {
        id: 'parametrage',
        title: 'Paramétrage',
        type: 'item',
        icon: 'settings',
        url: 'parametrage'
    }
];
