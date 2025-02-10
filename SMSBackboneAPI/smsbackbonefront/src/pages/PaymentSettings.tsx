import React, { useState } from 'react';
import { Checkbox, TextField, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

const PaymentSettings: React.FC = () => {
    const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
    const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
    const [threshold, setThreshold] = useState('');
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

    const users = [
        { id: 1, name: 'Alma Buyoli', role: 'Administrator', icon: '👤' },
        { id: 2, name: 'Esteban B', role: 'Supervisor', icon: '👤' },
        { id: 3, name: 'Francisco D', role: 'Monitor', icon: '👤' },
    ];

    const handleNotificationToggle = () => {
        setIsNotificationEnabled((prev) => !prev);
    };

    const handleChannelToggle = (channel: string) => {
        setSelectedChannels((prev) =>
            prev.includes(channel) ? prev.filter((ch) => ch !== channel) : [...prev, channel]
        );
    };

    const handleUserToggle = (userId: number) => {
        setSelectedUsers((prev) =>
            prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
        );
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
            <h2 style={{ fontSize: '20px', color: '#574B4F', marginBottom: '10px' }}>Payment Settings</h2>
            <Checkbox
                checked={isNotificationEnabled}
                onChange={handleNotificationToggle}
                style={{ marginBottom: '10px' }}
            />
            <span
                style={{
                    textAlign: 'left',
                    font: 'normal normal 600 16px/20px Poppins',
                    color: '#574B4F',
                    fontSize: '16px',
                }}
            >
                Enable email notifications for credit balance alerts.
            </span>

            {/* Las secciones aparecen deshabilitadas si `isNotificationEnabled` es falso */}
            <div style={{ opacity: isNotificationEnabled ? 1 : 0.5, pointerEvents: isNotificationEnabled ? 'auto' : 'none' }}>
                {/* Canales */}
                <h3 style={{ fontSize: '16px', color: '#574B4F', margin: '20px 0 10px' }}>Select Channel</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {['SMS #short', 'SMS #long', 'Call'].map((channel) => (
                        <label key={channel} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Checkbox
                                checked={selectedChannels.includes(channel)}
                                onChange={() => handleChannelToggle(channel)}
                                disabled={!isNotificationEnabled}
                            />
                            <span style={{ color: '#574B4F', fontSize: '14px' }}>{channel}</span>
                        </label>
                    ))}
                </div>

                {/* Cantidad */}
                <h3 style={{ fontSize: '16px', color: '#574B4F', margin: '20px 0 10px' }}>Threshold</h3>
                <TextField
                    value={threshold}
                    onChange={(e) => setThreshold(e.target.value)}
                    type="number"
                    fullWidth
                    disabled={!isNotificationEnabled}
                />

                {/* Tabla de usuarios */}
                <h3 style={{ fontSize: '16px', color: '#574B4F', margin: '20px 0 10px' }}>
                    Select users to receive notifications
                </h3>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>Name</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Icon</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <Checkbox
                                        checked={selectedUsers.includes(user.id)}
                                        onChange={() => handleUserToggle(user.id)}
                                        disabled={!isNotificationEnabled}
                                    />
                                </TableCell>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>{user.icon}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default PaymentSettings;
