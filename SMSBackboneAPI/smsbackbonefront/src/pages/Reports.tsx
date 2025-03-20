import { useState } from "react";
import React from "react";
import { Tabs, Tab, Box, Button, Card, CardContent, Typography, Divider } from "@mui/material";
import { Package } from "lucide-react";

const Reports: React.FC = () => {
    const [selectedTab, setSelectedTab] = useState("SMS");

    const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
        setSelectedTab(newValue);
    };

    return (
        <Box p={4}>
            <Typography
                variant="h4"
                fontWeight="medium"
                sx={{
                    textAlign: "left",
                    fontSize: "26px",
                    lineHeight: "55px",
                    fontFamily: "Poppins, sans-serif",
                    letterSpacing: "0px",
                    color: "#330F1B",
                    opacity: 1
                }}
            >
                Reportes
            </Typography>


            {/* Línea superior más pegada a los Tabs */}
            <Divider sx={{ mt: 2, mb: 1, width: "100%" }} />

            {/* Tabs pegadas a la izquierda */}
            <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                aria-label="report-tabs"
                sx={{ minHeight: "auto", mb: 1 }} // Ajuste para minimizar el padding extra
            >
                <Tab label="SMS" value="SMS" sx={{ minHeight: "auto", padding: "4px 12px" }} />
                <Tab label="Llamada" value="Llamada" sx={{ minHeight: "auto", padding: "4px 12px" }} disabled={true} />
            </Tabs>

            {/* Línea inferior más pegada a los Tabs */}
            <Divider sx={{ mt: 1, mb: 2, width: "100%" }} />
            {/* Filters */}
            <Box display="flex" gap={2} mb={4}>
                <Button variant="outlined">Fecha</Button>
                <Button variant="outlined">Campaña</Button>
                <Button variant="outlined">Usuario</Button>
            </Box>

            {/* Content */}
            <Card sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", p: 5, textAlign: "center" }}>
                <CardContent>
                    <Package size={64} color="gray" />
                    <Typography color="textSecondary" mt={2}>
                        Seleccione un canal del menú superior para comenzar.
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Reports;
