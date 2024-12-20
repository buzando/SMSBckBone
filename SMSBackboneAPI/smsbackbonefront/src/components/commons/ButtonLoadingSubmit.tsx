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
                sx={{
                    background: "#833A53 0% 0% no-repeat padding-box",
                    border: "1px solid #60293C",
                    borderRadius: "4px",
                    opacity: 0.9,
                    color: "#FFFFFF",
                }}
                type="submit">
                {label}
            </Button>
        </Box>
    )
}

export default ButtonLoading;
