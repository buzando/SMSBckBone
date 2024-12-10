import React from 'react';
import Typography from "@mui/material/Typography"
import Divider from "@mui/material/Divider"
import Grid from "@mui/material/Grid"
import Paper from "@mui/material/Paper";
import { LineChart } from '@mui/x-charts/LineChart';


const xLabels = [
    '14:00',
    '14:10',
    '14:20',
    '14:30',
    '14:40',
    '14:50',
    '15:00',
    '15:10',
    '15:20',
    '15:30',
    '15:40',
    '15:50',
    '16:00',
];

const HomePage: React.FC = () => {
    return (
        <>
            <Typography variant='h4' fontWeight={'bold'} align='left' mt={2}>
                ¡Bienvenido de vuelta!
            </Typography>
            <Typography variant='body1' align='left' mb={2}>
                Te mostramos el resumen de tu actividad más reciente
            </Typography>
            <Divider sx={{ borderWidth: 1, mb: 2 }} />
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Paper elevation={15} sx={{ borderRadius: '10px', border: 'solid 1px gray' }}>
                        <Typography variant='h6' align='center' my={2}>
                            Porcentaje de consumo
                        </Typography>
                        <LineChart
                            yAxis={[{
                                label: '%'
                            }]}
                            xAxis={[{ label: 'Horas', scaleType: 'point', data: xLabels }]}
                            series={
                                [
                                    {
                                        data: [8, 38, 62, 42, 53, 30, 65, 70, 59, 75, 81, 93, 100],
                                        area: false,
                                    },
                                ]}
                            colors={['#7B354D']}
                            height={400}
                        />
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper elevation={3} sx={{ borderRadius: '10px', border: 'solid 1px gray' }}>
                        <Typography variant='h6' align='center' my={2}>
                            SMS Enviados
                        </Typography>
                        <Typography variant='h4' fontWeight={'bold'} color={'#7B354D'} align='center' my={2}>
                            3572
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper elevation={3} sx={{ borderRadius: '10px', border: 'solid 1px gray' }}>
                        <Typography variant='h6' align='center' my={2}>
                            SMS por día
                        </Typography>
                        <Typography variant='h4' fontWeight={'bold'} color={'#7B354D'} align='center' my={2}>
                            53%
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper elevation={3} sx={{ borderRadius: '10px', border: 'solid 1px gray' }}>
                        <Typography variant='h6' align='center' my={2}>
                            Consumo
                        </Typography>
                        <Typography variant='h4' fontWeight={'bold'} color={'#7B354D'} align='center' my={2}>
                            $ 1,500.00
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </>
    )
}

export default HomePage