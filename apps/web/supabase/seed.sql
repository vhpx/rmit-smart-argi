-- Populate auth users
INSERT INTO "auth"."users" (
        "instance_id",
        "id",
        "aud",
        "role",
        "email",
        "encrypted_password",
        "email_confirmed_at",
        "invited_at",
        "confirmation_token",
        "confirmation_sent_at",
        "recovery_token",
        "recovery_sent_at",
        "email_change_token_new",
        "email_change",
        "email_change_sent_at",
        "last_sign_in_at",
        "raw_app_meta_data",
        "raw_user_meta_data",
        "is_super_admin",
        "created_at",
        "updated_at",
        "phone",
        "phone_confirmed_at",
        "phone_change",
        "phone_change_token",
        "phone_change_sent_at",
        "email_change_token_current",
        "email_change_confirm_status",
        "banned_until",
        "reauthentication_token",
        "reauthentication_sent_at",
        "is_sso_user"
    )
VALUES (
        '00000000-0000-0000-0000-000000000000',
        '00000000-0000-0000-0000-000000000001',
        'authenticated',
        'authenticated',
        'local@tuturuuu.com',
        crypt('password123', gen_salt('bf')),
        '2023-02-18 23:31:13.017218+00',
        NULL,
        '',
        '2023-02-18 23:31:12.757017+00',
        '',
        NULL,
        '',
        '',
        NULL,
        '2023-02-18 23:31:13.01781+00',
        '{"provider": "email", "providers": ["email"]}',
        '{}',
        NULL,
        '2023-02-18 23:31:12.752281+00',
        '2023-02-18 23:31:13.019418+00',
        NULL,
        NULL,
        '',
        '',
        NULL,
        '',
        0,
        NULL,
        '',
        NULL,
        'f'
    ),
    (
        '00000000-0000-0000-0000-000000000000',
        '00000000-0000-0000-0000-000000000002',
        'authenticated',
        'authenticated',
        'user1@tuturuuu.com',
        crypt('password123', gen_salt('bf')),
        '2023-02-19 00:01:51.351735+00',
        NULL,
        '',
        '2023-02-19 00:01:51.147035+00',
        '',
        NULL,
        '',
        '',
        NULL,
        '2023-02-19 00:01:51.352369+00',
        '{"provider": "email", "providers": ["email"]}',
        '{}',
        NULL,
        '2023-02-19 00:01:51.142802+00',
        '2023-02-19 00:01:51.353896+00',
        NULL,
        NULL,
        '',
        '',
        NULL,
        '',
        0,
        NULL,
        '',
        NULL,
        'f'
    ),
    (
        '00000000-0000-0000-0000-000000000000',
        '00000000-0000-0000-0000-000000000003',
        'authenticated',
        'authenticated',
        'user2@tuturuuu.com',
        crypt('password123', gen_salt('bf')),
        '2023-02-18 23:36:54.88495+00',
        NULL,
        '',
        '2023-02-18 23:36:54.67958+00',
        '',
        NULL,
        '',
        '',
        NULL,
        '2023-02-18 23:36:54.885592+00',
        '{"provider": "email", "providers": ["email"]}',
        '{}',
        NULL,
        '2023-02-18 23:36:54.674532+00',
        '2023-02-18 23:36:54.887312+00',
        NULL,
        NULL,
        '',
        '',
        NULL,
        '',
        0,
        NULL,
        '',
        NULL,
        'f'
    ),
    (
        '00000000-0000-0000-0000-000000000000',
        '00000000-0000-0000-0000-000000000004',
        'authenticated',
        'authenticated',
        'user3@tuturuuu.com',
        crypt('password123', gen_salt('bf')),
        '2023-02-18 23:36:56.08865+00',
        NULL,
        '',
        '2023-02-18 23:36:55.827566+00',
        '',
        NULL,
        '',
        '',
        NULL,
        '2023-02-18 23:48:04.159175+00',
        '{"provider": "email", "providers": ["email"]}',
        '{}',
        NULL,
        '2023-02-18 23:36:55.823901+00',
        '2023-02-18 23:48:04.16081+00',
        NULL,
        NULL,
        '',
        '',
        NULL,
        '',
        0,
        NULL,
        '',
        NULL,
        'f'
    ),
    (
        '00000000-0000-0000-0000-000000000000',
        '00000000-0000-0000-0000-000000000005',
        'authenticated',
        'authenticated',
        'user4@tuturuuu.com',
        crypt('password123', gen_salt('bf')),
        '2023-02-18 23:30:49.554834+00',
        NULL,
        '',
        '2023-02-18 23:30:49.330541+00',
        '',
        NULL,
        '',
        '',
        NULL,
        '2023-02-18 23:48:24.578005+00',
        '{"provider": "email", "providers": ["email"]}',
        '{}',
        NULL,
        '2023-02-18 23:30:49.322994+00',
        '2023-02-18 23:48:24.579303+00',
        NULL,
        NULL,
        '',
        '',
        NULL,
        '',
        0,
        NULL,
        '',
        NULL,
        'f'
    );
-- Populate handles
insert into public.handles (value)
values ('local'),
    ('user1'),
    ('user2'),
    ('user3'),
    ('user4'),
    ('tuturuuu'),
    ('prototype-all'),
    ('prototype-general'),
    ('prototype-pharmacy'),
    ('prototype-school');
-- Update user handles
update public.users
set handle = 'local'
where id = '00000000-0000-0000-0000-000000000001';
update public.users
set handle = 'user1'
where id = '00000000-0000-0000-0000-000000000002';
update public.users
set handle = 'user2'
where id = '00000000-0000-0000-0000-000000000003';
update public.users
set handle = 'user3'
where id = '00000000-0000-0000-0000-000000000004';
update public.users
set handle = 'user4'
where id = '00000000-0000-0000-0000-000000000005';
-- Update user display names
update public.users
set display_name = 'Local'
where id = '00000000-0000-0000-0000-000000000001';
update public.users
set display_name = 'User 1'
where id = '00000000-0000-0000-0000-000000000002';
update public.users
set display_name = 'User 2'
where id = '00000000-0000-0000-0000-000000000003';
update public.users
set display_name = 'User 3'
where id = '00000000-0000-0000-0000-000000000004';
update public.users
set display_name = 'User 4'
where id = '00000000-0000-0000-0000-000000000005';
-- Populate workspaces
insert into public.workspaces (id, name, handle, creator_id)
values (
        '00000000-0000-0000-0000-000000000000',
        'Tuturuuu',
        'tuturuuu',
        '00000000-0000-0000-0000-000000000001'
    ),
    (
        '00000000-0000-0000-0000-000000000001',
        'Prototype All',
        'prototype-all',
        null
    ),
    (
        '00000000-0000-0000-0000-000000000002',
        'Prototype General',
        'prototype-general',
        null
    ),
    (
        '00000000-0000-0000-0000-000000000003',
        'Prototype Pharmacy',
        'prototype-pharmacy',
        null
    ),
    (
        '00000000-0000-0000-0000-000000000004',
        'Prototype School',
        'prototype-school',
        null
    );
-- Populate workspace_secrets
insert into public.workspace_secrets (ws_id, name, value)
values (
        '00000000-0000-0000-0000-000000000000',
        'ENABLE_CHAT',
        'true'
    ),
    (
        '00000000-0000-0000-0000-000000000000',
        'ENABLE_AI',
        'true'
    ),
    (
        '00000000-0000-0000-0000-000000000000',
        'ENABLE_DOCS',
        'true'
    ),
    (
        '00000000-0000-0000-0000-000000000000',
        'ENABLE_DRIVE',
        'true'
    ),
    (
        '00000000-0000-0000-0000-000000000000',
        'ENABLE_INVENTORY',
        'true'
    ),
    (
        '00000000-0000-0000-0000-000000000000',
        'ENABLE_FINANCE',
        'true'
    );
-- Populate workspace_members
insert into public.workspace_members (user_id, ws_id, role)
values (
        '00000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000000',
        'OWNER'
    ),
    (
        '00000000-0000-0000-0000-000000000002',
        '00000000-0000-0000-0000-000000000000',
        'ADMIN'
    ),
    (
        '00000000-0000-0000-0000-000000000003',
        '00000000-0000-0000-0000-000000000000',
        'MEMBER'
    ),
    (
        '00000000-0000-0000-0000-000000000004',
        '00000000-0000-0000-0000-000000000000',
        'OWNER'
    ),
    (
        '00000000-0000-0000-0000-000000000002',
        '00000000-0000-0000-0000-000000000001',
        'OWNER'
    ),
    (
        '00000000-0000-0000-0000-000000000003',
        '00000000-0000-0000-0000-000000000001',
        'MEMBER'
    ),
    (
        '00000000-0000-0000-0000-000000000003',
        '00000000-0000-0000-0000-000000000002',
        'OWNER'
    ),
    (
        '00000000-0000-0000-0000-000000000003',
        '00000000-0000-0000-0000-000000000003',
        'OWNER'
    ),
    (
        '00000000-0000-0000-0000-000000000002',
        '00000000-0000-0000-0000-000000000004',
        'ADMIN'
    );
-- Populate workspace_invites with remaining users
insert into public.workspace_invites (user_id, ws_id, role, role_title)
values (
        '00000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000001',
        'MEMBER',
        'Default Local Account'
    ),
    (
        '00000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000002',
        'ADMIN',
        'DLA'
    ),
    (
        '00000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000003',
        'OWNER',
        'DLA'
    ),
    (
        '00000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000004',
        'MEMBER',
        ''
    ),
    (
        '00000000-0000-0000-0000-000000000005',
        '00000000-0000-0000-0000-000000000000',
        'MEMBER',
        ''
    ),
    (
        '00000000-0000-0000-0000-000000000005',
        '00000000-0000-0000-0000-000000000001',
        'MEMBER',
        ''
    ),
    (
        '00000000-0000-0000-0000-000000000005',
        '00000000-0000-0000-0000-000000000002',
        'MEMBER',
        ''
    ),
    (
        '00000000-0000-0000-0000-000000000005',
        '00000000-0000-0000-0000-000000000003',
        'MEMBER',
        ''
    ),
    (
        '00000000-0000-0000-0000-000000000005',
        '00000000-0000-0000-0000-000000000004',
        'MEMBER',
        ''
    ),
    (
        '00000000-0000-0000-0000-000000000003',
        '00000000-0000-0000-0000-000000000004',
        'MEMBER',
        ''
    ),
    (
        '00000000-0000-0000-0000-000000000004',
        '00000000-0000-0000-0000-000000000004',
        'MEMBER',
        ''
    );
-- Populate workspace_teams
insert into public.workspace_teams (id, name, ws_id)
values (
        '00000000-0000-0000-0000-000000000001',
        'Alpha',
        '00000000-0000-0000-0000-000000000001'
    ),
    (
        '00000000-0000-0000-0000-000000000002',
        'Beta',
        '00000000-0000-0000-0000-000000000001'
    ),
    (
        '00000000-0000-0000-0000-000000000003',
        'Lora',
        '00000000-0000-0000-0000-000000000002'
    ),
    (
        '00000000-0000-0000-0000-000000000004',
        'Kora',
        '00000000-0000-0000-0000-000000000002'
    ),
    (
        '00000000-0000-0000-0000-000000000005',
        'Mora',
        '00000000-0000-0000-0000-000000000002'
    );
-- Populate documents
insert into public.workspace_documents (name, ws_id)
values (
        'Document 1',
        '00000000-0000-0000-0000-000000000001'
    ),
    (
        'Document 2',
        '00000000-0000-0000-0000-000000000001'
    ),
    (
        'Document 3',
        '00000000-0000-0000-0000-000000000002'
    ),
    (
        'Document 4',
        '00000000-0000-0000-0000-000000000002'
    ),
    (
        'Document 5',
        '00000000-0000-0000-0000-000000000003'
    ),
    (
        'Document 6',
        '00000000-0000-0000-0000-000000000004'
    );
-- Populate boards
insert into public.workspace_boards (id, name, ws_id)
values (
        '00000000-0000-0000-0000-000000000001',
        'Board 1',
        '00000000-0000-0000-0000-000000000001'
    ),
    (
        '00000000-0000-0000-0000-000000000002',
        'Board 2',
        '00000000-0000-0000-0000-000000000002'
    ),
    (
        '00000000-0000-0000-0000-000000000003',
        'Board 3',
        '00000000-0000-0000-0000-000000000003'
    ),
    (
        '00000000-0000-0000-0000-000000000004',
        'Board 4',
        '00000000-0000-0000-0000-000000000004'
    );
-- Populate wallets
insert into public.workspace_wallets (id, name, ws_id)
values (
        '00000000-0000-0000-0000-000000000001',
        'Wallet 1',
        '00000000-0000-0000-0000-000000000001'
    ),
    (
        '00000000-0000-0000-0000-000000000002',
        'Wallet 2',
        '00000000-0000-0000-0000-000000000001'
    ),
    (
        '00000000-0000-0000-0000-000000000003',
        'Wallet 3',
        '00000000-0000-0000-0000-000000000002'
    ),
    (
        '00000000-0000-0000-0000-000000000004',
        'Wallet 4',
        '00000000-0000-0000-0000-000000000002'
    ),
    (
        '00000000-0000-0000-0000-000000000005',
        'Wallet 5',
        '00000000-0000-0000-0000-000000000003'
    ),
    (
        '00000000-0000-0000-0000-000000000006',
        'Wallet 6',
        '00000000-0000-0000-0000-000000000004'
    );
-- Populate transactions
insert into public.wallet_transactions (description, amount, wallet_id)
values (
        'Transaction 1',
        100000,
        '00000000-0000-0000-0000-000000000001'
    ),
    (
        'Transaction 2',
        200000,
        '00000000-0000-0000-0000-000000000001'
    ),
    (
        'Transaction 3',
        300000,
        '00000000-0000-0000-0000-000000000002'
    ),
    (
        'Transaction 4',
        400000,
        '00000000-0000-0000-0000-000000000002'
    ),
    (
        'Transaction 5',
        500000,
        '00000000-0000-0000-0000-000000000003'
    ),
    (
        'Transaction 6',
        600000,
        '00000000-0000-0000-0000-000000000004'
    );
-- Populate inventory product categories
insert into public.product_categories (id, name, ws_id)
values (
        '00000000-0000-0000-0000-000000000001',
        'Thuốc',
        '00000000-0000-0000-0000-000000000003'
    ),
    (
        '00000000-0000-0000-0000-000000000002',
        'Dụng cụ',
        '00000000-0000-0000-0000-000000000003'
    ),
    (
        '00000000-0000-0000-0000-000000000003',
        'Vật tư',
        '00000000-0000-0000-0000-000000000003'
    ),
    (
        '00000000-0000-0000-0000-000000000004',
        'Đồ ăn',
        '00000000-0000-0000-0000-000000000003'
    ),
    (
        '00000000-0000-0000-0000-000000000005',
        'Đồ uống',
        '00000000-0000-0000-0000-000000000003'
    ),
    (
        '00000000-0000-0000-0000-000000000006',
        'Đồ chơi',
        '00000000-0000-0000-0000-000000000003'
    );
-- Populate inventory units
insert into public.inventory_units (id, name, ws_id)
values (
        '00000000-0000-0000-0000-000000000001',
        'Vỉ',
        '00000000-0000-0000-0000-000000000003'
    ),
    (
        '00000000-0000-0000-0000-000000000002',
        'Viên',
        '00000000-0000-0000-0000-000000000003'
    ),
    (
        '00000000-0000-0000-0000-000000000003',
        'Hũ',
        '00000000-0000-0000-0000-000000000003'
    ),
    (
        '00000000-0000-0000-0000-000000000004',
        'Hộp',
        '00000000-0000-0000-0000-000000000003'
    ),
    (
        '00000000-0000-0000-0000-000000000005',
        'Lọ',
        '00000000-0000-0000-0000-000000000003'
    ),
    (
        '00000000-0000-0000-0000-000000000006',
        'Thùng',
        '00000000-0000-0000-0000-000000000003'
    ),
    (
        '00000000-0000-0000-0000-000000000007',
        'Cái',
        '00000000-0000-0000-0000-000000000003'
    ),
    (
        '00000000-0000-0000-0000-000000000008',
        'Chiếc',
        '00000000-0000-0000-0000-000000000003'
    ),
    (
        '00000000-0000-0000-0000-000000000009',
        'Cây',
        '00000000-0000-0000-0000-000000000003'
    ),
    (
        '00000000-0000-0000-0000-000000000010',
        'Bịch',
        '00000000-0000-0000-0000-000000000003'
    ),
    (
        '00000000-0000-0000-0000-000000000011',
        'Chai',
        '00000000-0000-0000-0000-000000000003'
    ),
    (
        '00000000-0000-0000-0000-000000000012',
        'Lon',
        '00000000-0000-0000-0000-000000000003'
    ),
    (
        '00000000-0000-0000-0000-000000000013',
        'Bao',
        '00000000-0000-0000-0000-000000000003'
    ),
    (
        '00000000-0000-0000-0000-000000000014',
        'Gói',
        '00000000-0000-0000-0000-000000000003'
    ),
    (
        '00000000-0000-0000-0000-000000000015',
        'Bình',
        '00000000-0000-0000-0000-000000000003'
    ),
    (
        '00000000-0000-0000-0000-000000000016',
        'Bộ',
        '00000000-0000-0000-0000-000000000003'
    ),
    (
        '00000000-0000-0000-0000-000000000017',
        'Ống',
        '00000000-0000-0000-0000-000000000003'
    );
-- Populate workspace products
insert into public.workspace_products (id, name, manufacturer, category_id, ws_id)
values (
        '00000000-0000-0000-0000-000000000001',
        'Thuốc trị đau',
        'ABC, Inc.',
        '00000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000003'
    ),
    (
        '00000000-0000-0000-0000-000000000002',
        'Thuốc trị viêm',
        'ABC, Inc.',
        '00000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000003'
    ),
    (
        '00000000-0000-0000-0000-000000000003',
        'Thuốc trị bệnh',
        'ABC, Inc.',
        '00000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000003'
    ),
    (
        '00000000-0000-0000-0000-000000000004',
        'Thuốc hạ sốt',
        'ABC, Inc.',
        '00000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000003'
    ),
    (
        '00000000-0000-0000-0000-000000000005',
        'Thuốc trị viêm họng',
        'ABC, Inc.',
        '00000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000003'
    ),
    (
        '00000000-0000-0000-0000-000000000006',
        '7-up',
        'Coca-Cola',
        '00000000-0000-0000-0000-000000000005',
        '00000000-0000-0000-0000-000000000003'
    ),
    (
        '00000000-0000-0000-0000-000000000007',
        'Pepsi',
        'PepsiCo',
        '00000000-0000-0000-0000-000000000005',
        '00000000-0000-0000-0000-000000000003'
    ),
    (
        '00000000-0000-0000-0000-000000000008',
        'Lego',
        'Lego Group',
        '00000000-0000-0000-0000-000000000006',
        '00000000-0000-0000-0000-000000000003'
    ),
    (
        '00000000-0000-0000-0000-000000000009',
        'Bánh kẹo',
        'ABC, Inc.',
        '00000000-0000-0000-0000-000000000004',
        '00000000-0000-0000-0000-000000000003'
    ),
    (
        '00000000-0000-0000-0000-000000000010',
        'Bánh mì',
        'Tous les Jours',
        '00000000-0000-0000-0000-000000000004',
        '00000000-0000-0000-0000-000000000003'
    );
-- Populate inventory suppliers
insert into public.inventory_suppliers (id, name, ws_id)
values (
        '00000000-0000-0000-0000-000000000001',
        'Nhà thuốc Long Châu',
        '00000000-0000-0000-0000-000000000003'
    ),
    (
        '00000000-0000-0000-0000-000000000002',
        'Nhà thuốc An Khang',
        '00000000-0000-0000-0000-000000000003'
    ),
    (
        '00000000-0000-0000-0000-000000000003',
        'Chợ thuốc',
        '00000000-0000-0000-0000-000000000003'
    );
-- Populate inventory warehouses
insert into public.inventory_warehouses (id, name, ws_id)
values (
        '00000000-0000-0000-0000-000000000001',
        'Kho nhà thuốc',
        '00000000-0000-0000-0000-000000000003'
    ),
    (
        '00000000-0000-0000-0000-000000000002',
        'Kho phụ',
        '00000000-0000-0000-0000-000000000003'
    );
-- Populate inventory products
insert into public.inventory_products (
        product_id,
        unit_id,
        warehouse_id,
        price,
        min_amount
    )
values (
        '00000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000002',
        '00000000-0000-0000-0000-000000000001',
        3800,
        80
    ),
    (
        '00000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000001',
        22000,
        60
    ),
    (
        '00000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000003',
        '00000000-0000-0000-0000-000000000001',
        92000,
        40
    ),
    (
        '00000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000004',
        '00000000-0000-0000-0000-000000000001',
        120000,
        20
    ),
    (
        '00000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000002',
        '00000000-0000-0000-0000-000000000002',
        4000,
        100
    ),
    (
        '00000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000002',
        23000,
        75
    ),
    (
        '00000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000003',
        '00000000-0000-0000-0000-000000000002',
        95000,
        50
    );
-- Populate inventory batches
insert into public.inventory_batches (
        id,
        warehouse_id,
        supplier_id,
        price,
        total_diff
    )
values (
        '00000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000001',
        3000000,
        50000
    ),
    (
        '00000000-0000-0000-0000-000000000002',
        '00000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000002',
        5000000,
        0
    );
-- Populate inventory batch products
insert into public.inventory_batch_products (
        batch_id,
        product_id,
        unit_id,
        amount,
        price
    )
values (
        '00000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000002',
        10000,
        2999000
    ),
    (
        '00000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000003',
        200,
        6000000
    ),
    (
        '00000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000004',
        50,
        3500000
    );
-- Populate transaction categories
insert into public.transaction_categories (id, name, is_expense, ws_id)
values (
        '00000000-0000-0000-0000-000000000001',
        'Nhập hàng',
        true,
        '00000000-0000-0000-0000-000000000003'
    ),
    (
        '00000000-0000-0000-0000-000000000002',
        'Bán hàng',
        false,
        '00000000-0000-0000-0000-000000000003'
    );
-- Populate vitals
insert into public.healthcare_vitals (id, ws_id, name, unit)
values (
        '00000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000003',
        'Nhiệt độ',
        '°C'
    ),
    (
        '00000000-0000-0000-0000-000000000002',
        '00000000-0000-0000-0000-000000000003',
        'Chiều cao',
        'cm'
    ),
    (
        '00000000-0000-0000-0000-000000000003',
        '00000000-0000-0000-0000-000000000003',
        'Cân nặng',
        'kg'
    ),
    (
        '00000000-0000-0000-0000-000000000004',
        '00000000-0000-0000-0000-000000000003',
        'Huyết áp',
        'mmHg'
    ),
    (
        '00000000-0000-0000-0000-000000000005',
        '00000000-0000-0000-0000-000000000003',
        'Nhịp tim',
        'lần/phút'
    ),
    (
        '00000000-0000-0000-0000-000000000006',
        '00000000-0000-0000-0000-000000000003',
        'Nhịp thở',
        'lần/phút'
    );
-- Populate diagnoses
insert into public.healthcare_diagnoses (id, ws_id, name, description)
values (
        '00000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000003',
        'Sốt',
        'Sốt là tình trạng nhiệt độ cơ thể cao hơn 37,5°C.'
    ),
    (
        '00000000-0000-0000-0000-000000000002',
        '00000000-0000-0000-0000-000000000003',
        'Đau bụng',
        'Đau bụng là tình trạng đau ở vùng bụng.'
    ),
    (
        '00000000-0000-0000-0000-000000000003',
        '00000000-0000-0000-0000-000000000003',
        'Đau đầu',
        'Đau đầu là tình trạng đau ở vùng đầu.'
    );
-- Populate vital_groups
insert into public.healthcare_vital_groups (id, ws_id, name, description)
values (
        '00000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000003',
        'Sức khỏe',
        'Nhóm các chỉ số sức khỏe của bệnh nhân.'
    ),
    (
        '00000000-0000-0000-0000-000000000002',
        '00000000-0000-0000-0000-000000000003',
        'Tình trạng',
        'Nhóm các chỉ số tình trạng của bệnh nhân.'
    );
-- Populate vital_group_vitals
insert into public.vital_group_vitals (group_id, vital_id)
values (
        '00000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000001'
    ),
    (
        '00000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000002'
    ),
    (
        '00000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000003'
    ),
    (
        '00000000-0000-0000-0000-000000000002',
        '00000000-0000-0000-0000-000000000004'
    ),
    (
        '00000000-0000-0000-0000-000000000002',
        '00000000-0000-0000-0000-000000000005'
    ),
    (
        '00000000-0000-0000-0000-000000000002',
        '00000000-0000-0000-0000-000000000006'
    );
-- Populate workspace_users
insert into public.workspace_users (
        full_name,
        email,
        phone,
        birthday,
        gender,
        ethnicity,
        guardian,
        address,
        national_id,
        ws_id
    )
values (
        'Nguyen Van A',
        'nguyenvana@gmail.com',
        '0909090808',
        '1997-02-03',
        'MALE',
        'Kinh',
        'VHP',
        'VHP Address',
        '123456789',
        '00000000-0000-0000-0000-000000000003'
    ),
    (
        'Nguyen Van B',
        'nguyenvanb@gmail.com',
        '0909090808',
        '2001-06-02',
        'FEMALE',
        'Kinh',
        NULL,
        'q. Tân Bình, tp. Hồ Chí Minh',
        NULL,
        '00000000-0000-0000-0000-000000000003'
    ),
    (
        'Nguyễn Văn C',
        'nguyenvanc@gmail.com',
        '0912345678',
        '1992-03-29',
        'MALE',
        'Kinh',
        NULL,
        NULL,
        NULL,
        '00000000-0000-0000-0000-000000000003'
    );
-- Populate workspace user roles
insert into public.workspace_user_groups (id, name, ws_id)
values (
        '00000000-0000-0000-0000-000000000001',
        'Bệnh nhân',
        '00000000-0000-0000-0000-000000000003'
    ),
    (
        '00000000-0000-0000-0000-000000000002',
        'Bác sĩ',
        '00000000-0000-0000-0000-000000000003'
    ),
    (
        '00000000-0000-0000-0000-000000000003',
        'Y tá',
        '00000000-0000-0000-0000-000000000003'
    ),
    (
        '00000000-0000-0000-0000-000000000004',
        'Kế toán',
        '00000000-0000-0000-0000-000000000003'
    ),
    (
        '00000000-0000-0000-0000-000000000005',
        'Dược sĩ',
        '00000000-0000-0000-0000-000000000003'
    ),
    (
        '00000000-0000-0000-0000-000000000006',
        'Bảo vệ',
        '00000000-0000-0000-0000-000000000003'
    );

-- insert manage_workspace_roles as permission into workspace_default_permissions for all workspaces
insert into public.workspace_default_permissions (ws_id, permission, enabled)
values (
        '00000000-0000-0000-0000-000000000000',
        'manage_workspace_roles',
        true
    ),
    (
        '00000000-0000-0000-0000-000000000001',
        'manage_workspace_roles',
        true
    ),
    (
        '00000000-0000-0000-0000-000000000002',
        'manage_workspace_roles',
        true
    ),
    (
        '00000000-0000-0000-0000-000000000003',
        'manage_workspace_roles',
        true
    ),
    (
        '00000000-0000-0000-0000-000000000004',
        'manage_workspace_roles',
        true
    );