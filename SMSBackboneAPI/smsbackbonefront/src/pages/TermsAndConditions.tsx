import React from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';

const TermsAndConditions: React.FC = () => {
    return (
        <Box padding={3}>
            <Typography
                variant="h4"
                gutterBottom
                sx={{
                    textAlign: 'left',
                    font: 'normal normal medium 26px/55px Poppins',
                    letterSpacing: '0px',
                    color: '#330F1B',
                    opacity: 1
                }}
            >
                Términos y Condiciones
            </Typography>

            <Typography
                variant="body1"
                paragraph
                sx={{
                    textAlign: 'left',
                    font: 'normal normal normal 16px/20px Poppins',
                    letterSpacing: '0px',
                    color: '#330F1B',
                    opacity: 1
                }}
            >
                Aparte del crédito disponible en su cuenta, no establecemos un tope en el número de mensajes que puede enviar a través de nuestro servicio. Se evaluará si su comportamiento se alinea con los términos y esencia del acuerdo firmado entre las partes, y CENTERNEXT se reserva el derecho de finalizar el servicio en cualquier momento si su comportamiento viola lo establecido dentro del acuerdo firmado.
            </Typography>

            <Typography
                variant="body1"
                paragraph
                sx={{
                    textAlign: 'left',
                    font: 'normal normal normal 16px/20px Poppins',
                    letterSpacing: '0px',
                    color: '#330F1B',
                    opacity: 1
                }}
            >
                Nos esforzaremos por entregar sus mensajes tan rápido como sea posible, pero existen condiciones de demoras derivado de congestiones o tráfico alto en la red. A pesar de estos retrasos, el mensaje podría mostrarse como “entregado”.
            </Typography>

            <Typography
                variant="h6"
                gutterBottom
                sx={{
                    textAlign: 'left',
                    font: 'normal normal normal 16px/20px Poppins',
                    letterSpacing: '0px',
                    color: '#330F1B',
                    opacity: 1
                }}
            >
                Se compromete a utilizar los servicios únicamente:
            </Typography>

            <List>
                <ListItem>
                    <ListItemText
                        primary="Siguiendo estos términos y condiciones."
                        primaryTypographyProps={{
                            sx: {
                                textAlign: 'left',
                                font: 'normal normal normal 16px/20px Poppins',
                                letterSpacing: '0px',
                                color: '#330F1B',
                                opacity: 1
                            }
                        }}
                    />
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary="Con fines estrictamente apegados a la ley."
                        primaryTypographyProps={{
                            sx: {
                                textAlign: 'left',
                                font: 'normal normal normal 16px/20px Poppins',
                                letterSpacing: '0px',
                                color: '#330F1B',
                                opacity: 1
                            }
                        }}
                    />
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary="Respetando todas las leyes y normativas aplicables, tanto locales como internacionales."
                        primaryTypographyProps={{
                            sx: {
                                textAlign: 'left',
                                font: 'normal normal normal 16px/20px Poppins',
                                letterSpacing: '0px',
                                color: '#330F1B',
                                opacity: 1
                            }
                        }}
                    />
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary="Para los objetivos por los que fueron creados."
                        primaryTypographyProps={{
                            sx: {
                                textAlign: 'left',
                                font: 'normal normal normal 16px/20px Poppins',
                                letterSpacing: '0px',
                                color: '#330F1B',
                                opacity: 1
                            }
                        }}
                    />
                </ListItem>
            </List>

            <Typography
                variant="h6"
                gutterBottom
                sx={{
                    textAlign: 'left',
                    font: 'normal normal normal 16px/20px Poppins',
                    letterSpacing: '0px',
                    color: '#330F1B',
                    opacity: 1
                }}
            >
                Al emplear nuestros servicios, deberá evitar:
            </Typography>

            <List>
                <ListItem>
                    <ListItemText
                        primary="Enviar mensajes SMS no solicitados o spam."
                        primaryTypographyProps={{
                            sx: {
                                textAlign: 'left',
                                font: 'normal normal normal 16px/20px Poppins',
                                letterSpacing: '0px',
                                color: '#330F1B',
                                opacity: 1
                            }
                        }}
                    />
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary="Engañar, estafar o falsificar su identidad ante cualquier persona por cualquier motivo."
                        primaryTypographyProps={{
                            sx: {
                                textAlign: 'left',
                                font: 'normal normal normal 16px/20px Poppins',
                                letterSpacing: '0px',
                                color: '#330F1B',
                                opacity: 1
                            }
                        }}
                    />
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary="Alterar los detalles de origen en cualquier mensaje electrónico para ocultar o eliminar su procedencia."
                        primaryTypographyProps={{
                            sx: {
                                textAlign: 'left',
                                font: 'normal normal normal 16px/20px Poppins',
                                letterSpacing: '0px',
                                color: '#330F1B',
                                opacity: 1
                            }
                        }}
                    />
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary="Enviar mensajes que sean difamatorios, discriminatorios, obscenos, ofensivos, amenazantes, abusivos, acosadores, dañinos, violentos o que contengan contenido pornográfico o de violencia infantil."
                        primaryTypographyProps={{
                            sx: {
                                textAlign: 'left',
                                font: 'normal normal normal 16px/20px Poppins',
                                letterSpacing: '0px',
                                color: '#330F1B',
                                opacity: 1
                            }
                        }}
                    />
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary="Participar en fraudes o promover actividades comerciales o no comerciales fraudulentas como estafas financieras o esquemas piramidales."
                        primaryTypographyProps={{
                            sx: {
                                textAlign: 'left',
                                font: 'normal normal normal 16px/20px Poppins',
                                letterSpacing: '0px',
                                color: '#330F1B',
                                opacity: 1
                            }
                        }}
                    />
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary="Infringir los derechos de propiedad intelectual."
                        primaryTypographyProps={{
                            sx: {
                                textAlign: 'left',
                                font: 'normal normal normal 16px/20px Poppins',
                                letterSpacing: '0px',
                                color: '#330F1B',
                                opacity: 1
                            }
                        }}
                    />
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary="Realizar acciones que puedan dañar o afectar sistemas, redes o servicios, incluyendo los de CENTERNEXT."
                        primaryTypographyProps={{
                            sx: {
                                textAlign: 'left',
                                font: 'normal normal normal 16px/20px Poppins',
                                letterSpacing: '0px',
                                color: '#330F1B',
                                opacity: 1
                            }
                        }}
                    />
                </ListItem>
            </List>

            <Typography
                variant="h6"
                gutterBottom
                sx={{
                    textAlign: 'left',
                    font: 'normal normal normal 16px/20px Poppins',
                    letterSpacing: '0px',
                    color: '#330F1B',
                    opacity: 1
                }}
            >
                Uso del Servicio API
            </Typography>

            <Typography
                variant="body1"
                paragraph
                sx={{
                    textAlign: 'left',
                    font: 'normal normal normal 16px/20px Poppins',
                    letterSpacing: '0px',
                    color: '#330F1B',
                    opacity: 1
                }}
            >
                Hemos habilitado la posibilidad de que las empresas o los individuos se conecten a nuestro servidor para facilitar el envío de mensajes de texto directamente a nuestro sistema de SMS. Nos reservamos el derecho de aprobar o rechazar conexiones de clientes y APIs según nuestro propio criterio.
            </Typography>

            <Typography
                variant="body1"
                paragraph
                sx={{
                    textAlign: 'left',
                    font: 'normal normal normal 16px/20px Poppins',
                    letterSpacing: '0px',
                    color: '#330F1B',
                    opacity: 1
                }}
            >
                Promovemos activamente las políticas contra el envío de spam (mensajes no solicitados). Proporcionaremos especificaciones para las conexiones API y nos esforzaremos por mantenerlas actualizadas. Estas especificaciones pueden estar incompletas y estar sujetas a cambios sin previo aviso. Es su responsabilidad revisar periódicamente estas especificaciones, ya que no nos hacemos responsables por cualquier inexactitud o información incompleta en ellas.
            </Typography>

            <Typography
                variant="body1"
                paragraph
                sx={{
                    textAlign: 'left',
                    font: 'normal normal normal 16px/20px Poppins',
                    letterSpacing: '0px',
                    color: '#330F1B',
                    opacity: 1
                }}
            >
                Para todos los servicios de mensajería SMS, le proporcionaremos un nombre de usuario y contraseña. Cualquier medida de seguridad adicional incluyendo, pero no limitado a la gestión de accesos y contraseñas, uso indebido, etc., quedará bajo responsabilidad del usuario. EL CLIENTE será responsable totalmente de la gestión de las contraseñas y acceso al sistema donde se utiliza el servicio de SMS. CENTERNEXT quedará exento de cualquier uso inapropiado o indebido realizado por cuentas que gestionan el SMS.
            </Typography>
        </Box>
    );
};

export default TermsAndConditions;
