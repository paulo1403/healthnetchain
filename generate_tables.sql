-- SQLite
create table
    patients (
        patient_id integer primary key autoincrement,
        name varchar(50) not null,
        surname varchar(50) not null,
        document_number varchar(8) not null
    );
DROP TABLE if exists request_detail;
DROP TABLE requests;
create table
    requests (
        id integer primary key autoincrement,
        message text not null,
        status varchar(20) not null,
        file_url text not null,
        created_at timestamp not null DEFAULT CURRENT_TIMESTAMP,
        transmitter_clinic_id integer not NULL,
        receiver_clinic_id integer not NULL,
        patient_id integer NOT NULL,
        FOREIGN KEY (transmitter_clinic_id) REFERENCES clinics (clinic_id),
        FOREIGN KEY (receiver_clinic_id) REFERENCES clinics (clinic_id),
        FOREIGN KEY (patient_id) REFERENCES patients (patient_id)
    );

create table
    users (
        user_id integer not null primary key autoincrement,
        username varchar(50) not null,
        password varchar(100) not null
    );

create TABLE
    clinics (
        clinic_id integer primary key autoincrement,
        clinic_name varchar(50),
        clinic_address varchar(50),
        clinic_phone varchar(50),
        clinic_email varchar(50),
        clinic_website varchar(50),
        clinic_logo varchar(50), 
        user_id integer NOT NULL unique,
        FOREIGN KEY (user_id) REFERENCES users (user_id)
    );


