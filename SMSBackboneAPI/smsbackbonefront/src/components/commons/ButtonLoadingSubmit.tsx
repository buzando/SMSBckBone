
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box'

type props = {
    label: string;
    loading: boolean;
}
const ButtonLoading: React.FC<props> = ({ label, loading }) => {

    return (
        <Box sx={{ marginLeft: 1, position: "relative" }}>
            <Button
                variant="contained"
                color="primary"
                disabled={loading}
                type="submit">
                {label}
            </Button>
            {loading && <CircularProgress size={24} sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: '-12px',
                marginLeft: '-12px',
            }} />}
        </Box>
    )
}

export default ButtonLoading;
