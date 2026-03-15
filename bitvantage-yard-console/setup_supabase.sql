CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'TALLYMAN', -- ADMIN, MANAGER, PLANNER, TALLYMAN
    full_name VARCHAR(100),
    telegram_chat_id VARCHAR(50),
    notifications_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    telegram_notifications_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    receive_all_movement_alerts BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

CREATE TABLE terminal_blocks (
    block VARCHAR(10) PRIMARY KEY,
    label VARCHAR(100) NOT NULL,
    bay_count INTEGER NOT NULL,
    row_count INTEGER NOT NULL,
    tier_count INTEGER NOT NULL,
    equipment VARCHAR(100)
);

CREATE TABLE slot_overrides (
    slot_code VARCHAR(30) PRIMARY KEY,
    block VARCHAR(10) NOT NULL,
    bay VARCHAR(10) NOT NULL,
    row_num INTEGER NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    max_tiers INTEGER NOT NULL,
    allowed_container_types JSONB NOT NULL,
    notes TEXT
);

CREATE TABLE inventory (
    container_id VARCHAR(50) PRIMARY KEY,
    container_type VARCHAR(10) NOT NULL,
    block VARCHAR(10) NOT NULL,
    bay VARCHAR(10) NOT NULL,
    row_num INTEGER NOT NULL,
    tier_num INTEGER NOT NULL,
    position_code VARCHAR(30) NOT NULL,
    status VARCHAR(20) NOT NULL,
    direction VARCHAR(20) NOT NULL,
    line VARCHAR(100),
    expeditor VARCHAR(100),
    damages TEXT,
    seals TEXT,
    arrived_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now()),
    positioned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

CREATE TABLE operations_log (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    container_id VARCHAR(50) NOT NULL,
    operation_type VARCHAR(20) NOT NULL,
    old_position_code VARCHAR(30),
    new_position_code VARCHAR(30),
    operator_username VARCHAR(50),
    operator_full_name VARCHAR(100),
    operator_role VARCHAR(20),
    container_snapshot JSONB,
    performed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

CREATE TABLE notification_logs (
    notification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id VARCHAR(100),
    operation_type VARCHAR(20),
    container_id VARCHAR(50),
    targets JSONB,
    success BOOLEAN NOT NULL DEFAULT FALSE,
    response_text TEXT,
    status_code INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);
