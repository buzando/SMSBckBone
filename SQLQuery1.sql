use [SMS_WEB_API]

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
    userName VARCHAR(255) NOT NULL,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    status bit NOT NULL,
    createDate DATETIME2 NULL,
    lastPasswordChangeDate DATETIME2 null,
    email VARCHAR(255) NOT NULL,
    emailConfirmed BIT NOT NULL,
    lockoutEndDateUtc DATETIME2 null,
    lockoutEnabled BIT NOT NULL,
    accessFailedCount INT NOT NULL,
    idRole INT NOT NULL,
    clauseAccepted BIT NOT NULL,
    phoneNumber VARCHAR(50),
    TwoFactorAuthentication BIT NOT NULL,
    SMS BIT not null,
    Call BIT not null,
    passwordHash VARCHAR(255) not null,
    SecondaryEmail VARCHAR(255) not null,
    futureRooms bit null,
    FOREIGN KEY (idCliente) REFERENCES clients(id),
    FOREIGN KEY (idRole) REFERENCES Roles(id)
);

CREATE TABLE creditcards (
    id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL,
    card_number VARCHAR(16) NOT NULL,
    card_name VARCHAR(255) NOT NULL,
    expiration_month tinyint not null,
    expiration_year smallint NOT NULL,
    cvv char(3) NOT NULL,
    is_default BIT NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME,
    Type NVARCHAR(50),
	street NVARCHAR(255) NOT NULL, -- Calle
    exterior_number NVARCHAR(50) NOT NULL, -- Número exterior
    interior_number NVARCHAR(50) NULL, -- Número interior
    neighborhood NVARCHAR(255) NOT NULL, -- Colonia
    city NVARCHAR(255) NOT NULL, -- Ciudad
    state NVARCHAR(255) NOT NULL, -- Estado
    postal_code NVARCHAR(10) NOT NULL, -- Código postal (máx. 10 caracteres)
    FOREIGN KEY (user_id) REFERENCES users(id)
);

sp_help rooms
CREATE TABLE rooms (
    id INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(255) NOT NULL,
    calls INT NOT NULL,
    credits float NOT NULL,
    description NVARCHAR(255),
    long_sms float,
    short_sms float
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
    businessName NVARCHAR(255) NOT NULL, -- Nombre o razón social
    taxId NVARCHAR(50) NOT NULL,        -- RFC
    taxRegime NVARCHAR(255) NOT NULL,  -- Régimen fiscal
    cfdi NVARCHAR(255) NOT NULL,       -- CFDI
    postalCode NVARCHAR(10) NOT NULL,  -- Código postal
    createdAt DATETIME NOT NULL DEFAULT GETDATE(), -- Fecha de creación
    updatedAt DATETIME NULL,           -- Fecha de última actualización
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
alter table creditRecharge add EstatusError nvarchar(100) null

INSERT INTO Roles (Role) VALUES 
('Root'),
('Telco'),
('Administrador'),
('Supervisor'),
('Monitor');

CREATE TABLE Template (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Message NVARCHAR(MAX) NOT NULL,
    CreationDate DATETIME NOT NULL DEFAULT GETDATE(),
    IdRoom INT NOT NULL,
    FOREIGN KEY (IdRoom) REFERENCES Rooms(Id)
);

 
 create table BlackList (
id int identity(1,1) primary key not null,
CreationDate datetime not null,
phone nvarchar(50) not null,
Name nvarchar(100) not null,
ExpirationDate datetime null,
idroom int foreign key references rooms(id)
)

-- Tabla Campaigns
CREATE TABLE Campaigns (
    Id INT IDENTITY(1,1) PRIMARY KEY,
	RoomId int not null,
    Name NVARCHAR(255) NOT NULL,
    Message NVARCHAR(MAX) NULL,
    UseTemplate BIT DEFAULT 0,
    TemplateId INT NULL,
    AutoStart BIT DEFAULT 0,
    FlashMessage BIT DEFAULT 0,
    CustomANI BIT DEFAULT 0,
    RecycleRecords BIT DEFAULT 0,
    NumberType tinyint not NULL, -- 'Corto 1' o 'Largo 2'
    CreatedDate DATETIME DEFAULT GETDATE(),
    ModifiedDate DATETIME NULL,
    FOREIGN KEY (TemplateId) REFERENCES Template(Id),
	foreign key (RoomId) references rooms(Id)
);

-- Tabla CampaignSchedules
CREATE TABLE CampaignSchedules (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    CampaignId INT NOT NULL,
    StartDateTime DATETIME NOT NULL,
    EndDateTime DATETIME NOT NULL,
    OperationMode tinyint NULL, -- 'Reanudar 1' o 'Reciclar 2'
    [Order] INT NOT NULL,
    FOREIGN KEY (CampaignId) REFERENCES Campaigns(Id)
);

-- Tabla CampaignContacts
CREATE TABLE CampaignContacts (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    CampaignId INT NOT NULL,
    PhoneNumber NVARCHAR(20) NOT NULL,
    Dato NVARCHAR(40) NULL,
	DatoId nvarchar(40) NULL,
	Misc01 nvarchar(30) NULL,
	Misc02 nvarchar(30) NULL,
    FOREIGN KEY (CampaignId) REFERENCES Campaigns(Id)
);

CREATE TABLE CampaignContactsTemp (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    SessionId UNIQUEIDENTIFIER NOT NULL, -- lo generas en frontend
    PhoneNumber NVARCHAR(20) NOT NULL,
    Dato NVARCHAR(40) NULL,
    DatoId NVARCHAR(40) NULL,
    Misc01 NVARCHAR(30) NULL,
    Misc02 NVARCHAR(30) NULL,
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- Tabla CampaignRecycleSettings
CREATE TABLE CampaignRecycleSettings (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    CampaignId INT NOT NULL,
    TypeOfRecords NVARCHAR(20) NULL, -- 'Todos' o 'Rechazados'
    IncludeNotContacted BIT DEFAULT 0,
    NumberOfRecycles INT DEFAULT 0,
    FOREIGN KEY (CampaignId) REFERENCES Campaigns(Id)
);

-- Tabla CampaignBlacklist
CREATE TABLE blacklistcampains (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    idcampains INT NOT NULL,
    idblacklist INT NOT NULL,
    FOREIGN KEY (idcampains) REFERENCES Campaigns(Id),
    FOREIGN KEY (idblacklist) REFERENCES BlackList(Id)
);


CREATE TABLE client_access (
    id INT PRIMARY KEY IDENTITY(1,1),
    client_id INT NOT NULL FOREIGN KEY REFERENCES clients(id),
    username NVARCHAR(100) NOT NULL,
    password NVARCHAR(300) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    status BIT NOT NULL DEFAULT 1 -- activo/inactivo
);

CREATE TABLE tpm_CampaignContacts (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    SessionId NVARCHAR(100) NOT NULL,
    PhoneNumber NVARCHAR(20) NOT NULL,
    Dato NVARCHAR(100) NULL,
    DatoId NVARCHAR(100) NULL,
    Misc01 NVARCHAR(100) NULL,
    Misc02 NVARCHAR(100) NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    CreatedBy NVARCHAR(100) NULL
);
CREATE TABLE CampaignContactScheduleSend (
    Id INT PRIMARY KEY IDENTITY,
    CampaignId INT NOT NULL,
    ContactId INT NOT NULL,
    ScheduleId INT NOT NULL,
    SentAt DATETIME NULL,
    Status VARCHAR(50) NOT NULL, -- 'Pendiente', 'Enviado', 'Error', etc.
    ResponseMessage NVARCHAR(255) NULL,
    FOREIGN KEY (CampaignId) REFERENCES Campaigns(Id),
    FOREIGN KEY (ContactId) REFERENCES CampaignContacts(Id),
    FOREIGN KEY (ScheduleId) REFERENCES CampaignSchedules(Id)
);


alter table campaigns add StartDate DATETIME null
alter table campaigns add concatenate Bit not null default 0
alter table campaigns add shortenUrls Bit not null default 0

alter table campaigns drop column concatenate

alter table campaigns add ShouldConcatenate Bit not null default 0
alter table campaigns add ShouldShortenUrls Bit not null default 0

CREATE TABLE IFTLadas (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ClaveLada VARCHAR(5) NOT NULL, 
    Estado VARCHAR(100) NOT NULL,          
    Municipio VARCHAR(150) NOT NULL,       
    FechaCarga DATETIME DEFAULT GETDATE()   
);


Alter table CampaignContactScheduleSend add State nvarchar(50)

CREATE TABLE CreditRechargeOpenPay (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    idopenpay NVARCHAR(140) NOT NULL,
    IdCreditRecharge INT NULL,
    ChargeId NVARCHAR(200) NOT NULL,
    BankAuthorization NVARCHAR(200) NULL,
    Amount DECIMAL(10,2) NOT NULL,
    Status NVARCHAR(100) NOT NULL,
    CreationDate DATETIME NOT NULL,
    CardId NVARCHAR(200) NULL,
    CustomerId NVARCHAR(200) NULL,
    Conciliated BIT NOT NULL,
    Description NVARCHAR(600) NULL
);
select * from [dbo].[CreditRecharge]
alter table creditrecharge add EstatusError nvarchar(100) null -