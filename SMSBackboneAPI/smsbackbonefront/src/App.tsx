import { useEffect } from 'react'
import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme } from '@mui/material'
import { themeOptions } from './TSX/ThemeOptions'
import { ThemeProvider } from '@emotion/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage'
import AutentificationPage from './pages/AutentificationPage'
import Chooseroom from './pages/chooseroom'
import PasswordReset from './pages/PasswordReset'
import RegisterPage from './pages/RegisterPage'
//import UsersPage from './pages/private/UsersPage';
import PrivateRoute from './components/PrivateRoute';
import AutentificationRoute from './components/AutentificationRoute'
import { AppContextProvider } from './hooks/useContextInitialState'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import 'dayjs/locale/es-mx';
//import TermsAndConditions from './pages/public/TermsAndConditions';
//import PasswordReset from './pages/public/PasswordReset';
//import HelpPage from './pages/private/HelpPage';
//import ReportsPage from './pages/private/ReportsPage';
//import ApiTestPage from './pages/private/ApiTestPage';
import HomePage from './pages/HomePage';
//import PaymentHistoryPage from './pages/private/billing_temp/PaymentHistoryPage';
//import PaymentMethodsPage from './pages/private/billing_temp/PaymentMethodsPage';
//import PaymentUsagePage from './pages/private/billing_temp/PaymentUsagePage';
//import PaymentCostsPage from './pages/private/billing_temp/PaymentCostsPage';
//import PaymentSettingsPage from './pages/private/billing_temp/PaymentSettingsPage';
//import MyNumbersPage from './pages/private/numbers_temp/MyNumbersPage';
//import BuyNumbersPage from './pages/private/numbers_temp/BuyNumbersPage';


function App() {

    console.log(`MODE: ${import.meta.env.MODE}`)
    console.log(`API URL: ${import.meta.env.VITE_SMS_API_URL}`)
    useEffect(() => {
        const expirationDate = localStorage.getItem('expirationDate');
        if (expirationDate) {
            const expirationDateObj = new Date(expirationDate);
            const currentDate = new Date();
            const isExpired = expirationDateObj && expirationDateObj < currentDate;
            if (isExpired) {
                console.log("TOKEN EXPIRADO");
                localStorage.clear();
            }
        }
    }, [])



    let prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    prefersDarkMode = false; // Esta lienia es para que siempre se vea el tema claro
    const theme = createTheme(themeOptions(prefersDarkMode ? 'dark' : 'light'));
    return (
        <AppContextProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='es-mx'>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <BrowserRouter>
                        <Routes>
                            <Route path="/login" element={<LoginPage />} />
                            <Route element={<AutentificationRoute />} >
                                <Route path="/Autentification" element={<AutentificationPage />} />
                            </Route>
                            <Route element={<AutentificationRoute />} >
                                <Route path="/chooseroom" element={<Chooseroom />} />
                            </Route>
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/password_reset" element={<PasswordReset />} />
                            {/*<Route path="/legan/terms" element={<TermsAndConditions />} />*/}
                            <Route element={<PrivateRoute />}>
                                <Route path='/' element={<HomePage />} />
                            </Route>
                            {/*<Route element={<PrivateRoute />}>*/}
                            {/*    <Route path='/users' element={<UsersPage />} />*/}
                            {/*</Route>*/}
                            {/*<Route element={<PrivateRoute />}>*/}
                            {/*    <Route path='/billing/paymenthistory' element={<PaymentHistoryPage />} />*/}
                            {/*</Route>*/}
                            {/*<Route element={<PrivateRoute />}>*/}
                            {/*    <Route path='/billing/paymentmethods' element={<PaymentMethodsPage />} />*/}
                            {/*</Route>*/}
                            {/*<Route element={<PrivateRoute />}>*/}
                            {/*    <Route path='/billing/paymentusage' element={<PaymentUsagePage />} />*/}
                            {/*</Route>*/}
                            {/*<Route element={<PrivateRoute />}>*/}
                            {/*    <Route path='/billing/paymentcost' element={<PaymentCostsPage />} />*/}
                            {/*</Route>*/}
                            {/*<Route element={<PrivateRoute />}>*/}
                            {/*    <Route path='/billing/paymentsettings' element={<PaymentSettingsPage />} />*/}
                            {/*</Route>*/}
                            {/*<Route element={<PrivateRoute />}>*/}
                            {/*    <Route path='/reports' element={<ReportsPage />} />*/}
                            {/*</Route>*/}
                            {/*<Route element={<PrivateRoute />}>*/}
                            {/*    <Route path='/numbers/mynumbers' element={<MyNumbersPage />} />*/}
                            {/*</Route>*/}
                            {/*<Route element={<PrivateRoute />}>*/}
                            {/*    <Route path='/numbers/buynumbers' element={<BuyNumbersPage />} />*/}
                            {/*</Route>*/}
                            {/*<Route element={<PrivateRoute />}>*/}
                            {/*    <Route path='/apitest' element={<ApiTestPage />} />*/}
                            {/*</Route>*/}
                            {/*<Route element={<PrivateRoute />}>*/}
                            {/*    <Route path='/help' element={<HelpPage />} />*/}
                            {/*</Route>*/}
                        </Routes>
                    </BrowserRouter>
                </ThemeProvider>
            </LocalizationProvider>
        </AppContextProvider >
    )
}

export default App