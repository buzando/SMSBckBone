
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
        </Box>
    )
}

export default ButtonLoading;
