CREATE TABLE UserAccountRecovery (
    id INT PRIMARY KEY IDENTITY(1,1),
    idUser INT NOT NULL,
    token NVARCHAR(255) NOT NULL,
    Expiration DATETIME NOT NULL,
    Type NVARCHAR(50),
    FOREIGN KEY (idUser) REFERENCES users(id)
);

CREATE TABLE clients (
    id INT PRIMARY KEY IDENTITY(1,1),
    nombreCliente NVARCHAR(255) NOT NULL
);

CREATE TABLE Roles (
    id INT PRIMARY KEY IDENTITY(1,1),
    Role NVARCHAR(50) NOT NULL
);

CREATE TABLE users (
    id INT PRIMARY KEY IDENTITY(1,1),
    idCliente INT NOT NULL,
    userName NVARCHAR(255) NOT NULL,
    firstName NVARCHAR(255) NOT NULL,
    lastName NVARCHAR(255) NOT NULL,
    status NVARCHAR(50) NOT NULL,
    createDate DATETIME NOT NULL,
    lastPasswordChangeDate DATETIME,
    email NVARCHAR(255) NOT NULL,
    emailConfirmed BIT NOT NULL,
    lockoutEndDateUtc DATETIME,
    lockoutEnabled BIT NOT NULL,
    accessFailedCount INT NOT NULL,
    idRole INT NOT NULL,
    clauseAccepted BIT NOT NULL,
    phoneNumber NVARCHAR(20),
    TwoFactorAuthentication BIT NOT NULL,
    SMS BIT,
    Call BIT,
    passwordHash NVARCHAR(255),
    SecondaryEmail NVARCHAR(255),
    futureRooms NVARCHAR(MAX),
    FOREIGN KEY (idCliente) REFERENCES clients(id),
    FOREIGN KEY (idRole) REFERENCES Roles(id)
);

CREATE TABLE creditcards (
    id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL,
    card_number NVARCHAR(16) NOT NULL,
    card_name NVARCHAR(255) NOT NULL,
    expiration_month INT NOT NULL,
    expiration_year INT NOT NULL,
    cvv NVARCHAR(4) NOT NULL,
    is_default BIT NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME,
    Type NVARCHAR(50),
	street NVARCHAR(255) NOT NULL, -- Calle
    exterior_number NVARCHAR(50) NOT NULL, -- N�mero exterior
    interior_number NVARCHAR(50) NULL, -- N�mero interior
    neighborhood NVARCHAR(255) NOT NULL, -- Colonia
    city NVARCHAR(255) NOT NULL, -- Ciudad
    state NVARCHAR(255) NOT NULL, -- Estado
    postal_code NVARCHAR(10) NOT NULL, -- C�digo postal (m�x. 10 caracteres)
    created_at DATETIME NOT NULL DEFAULT GETDATE(), -- Fecha de creaci�n
    updated_at DATETIME NULL, -- Fecha de �ltima actualizaci�n
    Type NVARCHAR(50) NULL, -- Tipo de tarjeta (opcional)
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE rooms (
    id INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(255) NOT NULL,
    calls INT NOT NULL,
    credits DECIMAL(10,2) NOT NULL,
    description NVARCHAR(MAX),
    long_sms INT,
    short_sms INT
);

CREATE TABLE roomsbyuser (
    id INT PRIMARY KEY IDENTITY(1,1),
    idUser INT NOT NULL,
    idRoom INT NOT NULL,
    FOREIGN KEY (idUser) REFERENCES users(id),
    FOREIGN KEY (idRoom) REFERENCES rooms(id)
);

CREATE TABLE MyNumbers (
    id INT PRIMARY KEY IDENTITY(1,1),
    idUser INT NOT NULL,
    Number NVARCHAR(20) NOT NULL,
    Type NVARCHAR(50) NOT NULL,
    Service NVARCHAR(50),
    Cost DECIMAL(10,2),
    NextPaymentDate DATETIME,
    State NVARCHAR(50),
    Municipality NVARCHAR(50),
    Lada NVARCHAR(10),
    FOREIGN KEY (idUser) REFERENCES users(id)
);


CREATE TABLE BillingInformation (
    id INT PRIMARY KEY IDENTITY(1,1),
    userId INT NOT NULL,
    businessName NVARCHAR(255) NOT NULL, -- Nombre o raz�n social
    taxId NVARCHAR(50) NOT NULL,        -- RFC
    taxRegime NVARCHAR(255) NOT NULL,  -- R�gimen fiscal
    cfdi NVARCHAR(255) NOT NULL,       -- CFDI
    postalCode NVARCHAR(10) NOT NULL,  -- C�digo postal
    createdAt DATETIME NOT NULL DEFAULT GETDATE(), -- Fecha de creaci�n
    updatedAt DATETIME NULL,           -- Fecha de �ltima actualizaci�n
    FOREIGN KEY (userId) REFERENCES Users(id)
);

create table AmountNotification(
    id INT PRIMARY KEY IDENTITY(1,1),
	short_sms bit null,
	long_sms bit null,
	call bit null,
	AmountNotification decimal(10,2) not null,
	AutoRecharge bit null,
	AutoRechargeAmountNotification decimal(10,2) null,
	AutoRechargeAmount decimal(10,2) null,
	IdCreditcard int null, 
	foreign key (IdCreditcard) references creditcards(id)
	   )

	   create table AmountNotificationUser
	   (
	       id INT PRIMARY KEY IDENTITY(1,1),
		  userId INT NOT NULL  FOREIGN KEY (userId) REFERENCES Users(id),
		  NotificationId int not null foreign key(NotificationId) references AmountNotification(id)
	   )


Create table CreditRecharge (
id int primary key identity(1,1),
idCreditCard int not null foreign key references creditcards(id),
idUser int not null foreign key references users(id),
chanel varchar(50) not null,
quantityCredits bigint not null,
quantityMoney Decimal(10,2) not null,
RechargeDate datetime not null,
Estatus varchar(50) not null,
invoice varchar(300) null,
AutomaticInvoice bit not null,
)

select * from CreditRecharge

