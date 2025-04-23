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


INSERT INTO Roles (Role) VALUES 
('Root'),
('Telco'),
('Administrador'),
('Supervisor'),
('Monitor');


CREATE TABLE ccCamps (
id int primary key identity(1,1) not null,
    cam_id smallint NOT NULL,
    cli_id int NOT NULL,
    cam_descripcion varchar(40) NOT NULL,
    cam_activo smallint NOT NULL,
    cam_ModoManual tinyint NOT NULL,
    cam_modpredictivo tinyint NOT NULL,
    cam_TipoJobs tinyint NOT NULL,
    cam_tNoContesta tinyint NOT NULL,
    cam_SortColumns tinyint NOT NULL,
    cam_ocupado tinyint NOT NULL,
    cam_nocontesto tinyint NOT NULL,
    cam_graba tinyint NOT NULL,
    cam_fax tinyint NOT NULL,
    cam_callratio tinyint NOT NULL,
    cam_inter_ocupado smallint NOT NULL,
    cam_inter_nocontesto smallint NOT NULL,
    cam_inter_graba smallint NOT NULL,
    cam_inter_fax smallint NOT NULL,
    cam_NoInt_ocupado tinyint NOT NULL,
    cam_NoInt_nocontesto tinyint NOT NULL,
    cam_NoInt_graba tinyint NOT NULL,
    cam_NoInt_fax tinyint NOT NULL,
    cam_procesando bit NOT NULL,
    cam_dsn varchar(10) NOT NULL,
    cam_sql varchar(10) NOT NULL,
    cam_tnotas smallint NOT NULL,
    cam_tDialAfterWU smallint NOT NULL,
    cam_tDialAfterDLG smallint NOT NULL,
    cam_fDialOnWU tinyint NOT NULL,
    cam_fDialOnDLG tinyint NOT NULL,
    cam_tDialBeforeWU smallint NOT NULL,
    cam_tDialBeforeReady smallint NOT NULL,
    cam_bValidaTel tinyint NOT NULL,
    cam_bNew tinyint NULL,
    cam_ShowCalifWnd bit NOT NULL,
    cam_StartTimerOnHangUp bit NOT NULL,
    cam_fCreate smalldatetime NOT NULL,
    cam_MaxDlrXage decimal(3,1) NULL,
    ani varchar(15) NOT NULL,
    IDArea smallint NULL,
    EditableCallKey bit NOT NULL,
    iTipoDial tinyint NOT NULL,
    detectAnswerMachine smallint NOT NULL,
    detectVoiceMail tinyint NOT NULL,
    compliance tinyint NOT NULL,
    progDial smallint NOT NULL,
    excCallBack bit NOT NULL,
    keepDial bit NOT NULL,
    aggressionFactor float NOT NULL,
    dialOrder bit NOT NULL,
    dialPrefix varchar(10) NULL,
    listenManualCall bit NOT NULL,
    stopRecording bit NOT NULL,
    abandonCallback bit NOT NULL,
    t_autoCB smallint NOT NULL,
    id_anilist smallint NULL,
    dialPrefixMan varchar(10) NOT NULL,
    dialPrefixXfe varchar(10) NOT NULL,
    tDialonWrapUp smallint NOT NULL,
    cam_maxqueue smallint NOT NULL,
    DNCScrub int NOT NULL,
    callerIdDesc varchar(15) NULL,
    timeZoneRule int NOT NULL,
    surveyCamId int NULL,
    callsBySurvey int NOT NULL,
    ivrScript int NOT NULL,
    surveyPctg tinyint NOT NULL,
    call_record tinyint NOT NULL,
    startStopRecording bit NOT NULL,
    leaveRecMessage bit NOT NULL,
    manualCallOnChat bit NOT NULL,
    callBackSurveyAgent bit NOT NULL,
    callBackSurveyClient bit NOT NULL,
    funcEspDtmf int NULL,
    sipHdrFormat varchar(255) NULL,
    cam_inter_cancelled smallint NOT NULL,
    prefijo varchar(40) NULL,
    holdCall bit NOT NULL,
    exitAssisted bit NULL,
    rotativeAlgo tinyint NULL,
    previewDiscard bit NULL,
    cam_tPreview smallint NOT NULL,
    timesPreview tinyint NOT NULL,
    odbc_id smallint NULL,
    CampType int NULL,
    timesDiscard tinyint NOT NULL,
    selectRotativeANI int NULL,
    messagingOrder bit NULL,
    autoStart bit NULL,
    recordHold bit NULL,
    rowguid uniqueidentifier NOT NULL
);



CREATE TABLE ccSmsSchedules (
id int primary key identity(1,1) not null,
    cam_id smallint NULL,
    iDate datetime NULL,
    fDate datetime NULL,
    CONSTRAINT FK_Tabla_ccCamps FOREIGN KEY (id) REFERENCES ccCamps(id)
);


CREATE TABLE [dbo].[ccTimeZone] (
    tz_id int NOT NULL,
    tz_name varchar(50) NOT NULL,
    tz_offset float NOT NULL
);
