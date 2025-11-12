import React, {useState, useEffect} from 'react';

import {
    People as PeopleIcon,
    Assignment as AssignmentIcon,
    Chat as ChatIcon,
    TrendingUp as TrendingUpIcon,
    Notifications as ActivityIcon,
    BarChart as ChartIcon,
} from '@mui/icons-material';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Chip,
    useTheme,
    alpha,
    Avatar,
    Stack,
} from '@mui/material';
import { ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';

// Динамический импорт с отключением SSR
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
    loading: () => <div style={{height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Загрузка
        графика...</div>
});

interface DashboardStats {
    totalUsers: number;
    newRequests: number;
    activeChats: number;
    userGrowth: number;
}

interface RecentActivity {
    id: string;
    description: string;
    timestamp: string;
    status: 'new' | 'in_progress' | 'completed';
    type: 'user' | 'request' | 'chat' | 'system';
}

const Dashboard = () => {
    const theme = useTheme();
    const [stats, setStats] = useState<DashboardStats>({
        totalUsers: 1242,
        newRequests: 28,
        activeChats: 156,
        userGrowth: 12.5,
    });

    const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([
        {
            id: '1',
            description: 'Новый пользователь зарегистрирован',
            timestamp: '2 мин назад',
            status: 'new',
            type: 'user'
        },
        {
            id: '2',
            description: 'Заявка #245 обработана',
            timestamp: '15 мин назад',
            status: 'completed',
            type: 'request'
        },
        {
            id: '3',
            description: 'Чат поддержки начат',
            timestamp: '30 мин назад',
            status: 'in_progress',
            type: 'chat'
        },
        {
            id: '4',
            description: 'Системное обновление',
            timestamp: '1 час назад',
            status: 'completed',
            type: 'system'
        }
    ]);

    // Данные для графика
    const chartData: { series: ApexAxisChartSeries; options: ApexOptions } = {
        series: [
            {
                name: 'Активность',
                data: [30, 45, 70, 60, 85, 65, 90, 75, 95, 80, 110, 105, 100, 95, 120, 115, 110, 105, 130, 125, 120, 115, 140, 135, 130, 125, 150, 145, 160, 155]
            }
        ],
        options: {
            chart: {
                type: 'line',
                height: 300,
                toolbar: {
                    show: false
                },
                zoom: {
                    enabled: false
                },
                animations: {
                    enabled: true,
                    easing: 'easeinout',
                    speed: 800
                }
            },
            colors: [theme.palette.primary.main],
            stroke: {
                width: 4,
                curve: 'smooth',
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shade: 'dark',
                    gradientToColors: [theme.palette.primary.light],
                    shadeIntensity: 1,
                    type: 'vertical',
                    opacityFrom: 0.7,
                    opacityTo: 0.1,
                    stops: [0, 100]
                }
            },
            grid: {
                borderColor: alpha(theme.palette.divider, 0.1),
                strokeDashArray: 3,
                padding: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                }
            },
            markers: {
                size: 6,
                strokeWidth: 3,
                strokeColors: theme.palette.background.paper,
                colors: [theme.palette.primary.main],
                hover: {
                    size: 8
                }
            },
            xaxis: {
                categories: Array.from({length: 30}, (_, i) => (i + 1).toString()),
                axisBorder: {
                    show: false
                },
                axisTicks: {
                    show: false
                },
                labels: {
                    style: {
                        colors: theme.palette.text.secondary,
                        fontSize: '12px',
                        fontWeight: 600
                    }
                }
            },
            yaxis: {
                labels: {
                    style: {
                        colors: theme.palette.text.secondary,
                        fontSize: '12px',
                        fontWeight: 600
                    },
                    formatter: (value: number) => `${value}%`
                },
                min: 0,
                max: 180
            },
            tooltip: {
                theme: theme.palette.mode,
                style: {
                    fontSize: '14px',
                    fontFamily: theme.typography.fontFamily
                },
                y: {
                    formatter: (value: number) => `${value}% активности`
                }
            },
            dataLabels: {
                enabled: false
            },
            legend: {
                show: false
            }
        } as ApexOptions
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new':
                return 'primary';
            case 'in_progress':
                return 'warning';
            case 'completed':
                return 'success';
            default:
                return 'default';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'new':
                return 'Новая';
            case 'in_progress':
                return 'В работе';
            case 'completed':
                return 'Выполнена';
            default:
                return status;
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'user':
                return '👤';
            case 'request':
                return '📋';
            case 'chat':
                return '💬';
            case 'system':
                return '⚙️';
            default:
                return '📄';
        }
    };

    const StatCard = ({
                          title,
                          value,
                          icon,
                          growth,
                          index,
                          color = 'primary',
                      }: {
        title: string;
        value: number;
        icon: React.ReactNode;
        growth?: number;
        index: number;
        color?: 'primary' | 'secondary' | 'success' | 'warning';
    }) => {
        const colorMap = {
            primary: theme.palette.primary.main,
            secondary: theme.palette.secondary.main,
            success: theme.palette.success.main,
            warning: theme.palette.warning.main,
        };

        return (
            <Card
                sx={{
                    borderRadius: 1,
                    height: '100%',
                    background: alpha(colorMap[color], 0.4),
                    border: `1px solid ${alpha(colorMap[color], 0.2)}`,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.04)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <CardContent sx={{p: 3, '&:last-child': {pb: 3}}}>
                    <Stack spacing={2}>
                        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                            <Avatar
                                sx={{
                                    width: 48,
                                    height: 48,
                                    background: `linear-gradient(135deg, ${colorMap[color]}, ${alpha(colorMap[color], 0.8)})`,
                                    boxShadow: `0 8px 24px ${alpha(colorMap[color], 0.3)}`,
                                }}
                            >
                                {icon}
                            </Avatar>
                            {growth !== undefined && (
                                <Chip
                                    label={`${growth >= 0 ? '+' : ''}${growth}%`}
                                    size="small"
                                    color={growth >= 0 ? 'success' : 'error'}
                                    sx={{fontWeight: 700}}
                                />
                            )}
                        </Box>

                        <Box>
                            <Typography
                                variant="overline"
                                sx={{
                                    fontWeight: 600,
                                    letterSpacing: 0.5,
                                    color: alpha(theme.palette.text.primary, 0.7),
                                    fontSize: '0.75rem',
                                }}
                            >
                                {title}
                            </Typography>
                            <Typography
                                variant="h3"
                                sx={{
                                    fontWeight: 800,
                                    background: `linear-gradient(135deg, ${colorMap[color]}, ${alpha(colorMap[color], 0.8)})`,
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    lineHeight: 1.2,
                                }}
                            >
                                {value.toLocaleString()}
                            </Typography>
                        </Box>
                    </Stack>
                </CardContent>
            </Card>
        );
    };

    return (
        <Box sx={{p: 3}}>
            {/* Заголовок */}
            <Box sx={{mb: 4}}>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 800,
                        background: theme.palette.primary.main,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 1,
                    }}
                >
                    Панель управления
                </Typography>
                <Typography variant="body1" sx={{fontWeight: 500}}>
                    Обзор статистики и активности системы
                </Typography>
            </Box>

            {/* Статистика */}
            <Grid container spacing={3} sx={{mb: 4}}>
                <Grid item xs={12} sm={6} lg={3}>
                    <StatCard
                        title="Всего пользователей"
                        value={stats.totalUsers}
                        icon={<PeopleIcon/>}
                        growth={stats.userGrowth}
                        index={0}
                        color="primary"
                    />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                    <StatCard
                        title="Новые заявки"
                        value={stats.newRequests}
                        icon={<AssignmentIcon/>}
                        index={1}
                        color="warning"
                    />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                    <StatCard
                        title="Активные чаты"
                        value={stats.activeChats}
                        icon={<ChatIcon/>}
                        index={2}
                        color="secondary"
                    />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                    <StatCard
                        title="Рост активности"
                        value={Math.round(stats.userGrowth)}
                        icon={<TrendingUpIcon/>}
                        index={3}
                        color="success"
                    />
                </Grid>
            </Grid>

            {/* График + Активность */}
            <Grid container spacing={3}>
                {/* График */}
                <Grid item xs={12} lg={8} sx={{display: {xs: 'none', sm: 'block'}}}>
                    <Card
                        sx={{
                            borderRadius: 1,
                            height: '100%',
                            background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            boxShadow: '0 8px 32px rgba(0,0,0,0.04)',
                        }}
                    >
                        <CardContent sx={{p: 3}}>
                            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3}}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 700,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                    }}
                                >
                                    <ChartIcon color="primary"/>
                                    Аналитика активности
                                </Typography>
                                <Chip label="Последние 30 дней" variant="outlined" size="small"/>
                            </Box>

                            <Box sx={{position: 'relative'}}>
                                <ReactApexChart
                                    options={chartData.options}
                                    series={chartData.series}
                                    type="line"
                                    height={300}
                                />
                            </Box>

                            {/* Легенда и дополнительная информация */}
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                mt: 2,
                                pt: 2,
                                borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                            }}>
                                <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                    <Box sx={{
                                        width: 12,
                                        height: 3,
                                        background: theme.palette.primary.main,
                                        borderRadius: 2
                                    }}/>
                                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                        Активность пользователей
                                    </Typography>
                                </Box>
                                <Box sx={{display: 'flex', gap: 3}}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" display="block">
                                            Пиковая
                                        </Typography>
                                        <Typography variant="caption" fontWeight={700}
                                                    color={theme.palette.success.main}>
                                            160%
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" display="block">
                                            Минимальная
                                        </Typography>
                                        <Typography variant="caption" fontWeight={700}
                                                    color={theme.palette.warning.main}>
                                            30%
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Последняя активность */}
                <Grid item xs={12} lg={4}>
                    <Card
                        sx={{
                            borderRadius: 1,
                            height: '100%',
                            background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            boxShadow: '0 8px 32px rgba(0,0,0,0.04)',
                        }}
                    >
                        <CardContent sx={{py: 3, px: 1}}>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 700,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    mb: 3,
                                }}
                            >
                                <ActivityIcon color="primary"/>
                                Последняя активность
                            </Typography>

                            <Stack spacing={2}>
                                {recentActivity.map((activity) => (
                                    <Box
                                        key={activity.id}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: 2,
                                            p: 2,
                                            borderRadius: 1,
                                            background: alpha(theme.palette.background.default, 0.5),
                                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                background: alpha(theme.palette.primary.main, 0.05),
                                                borderColor: alpha(theme.palette.primary.main, 0.2),
                                                cursor: 'pointer'
                                            },
                                        }}
                                    >
                                        <Box sx={{fontSize: 20}}>{getTypeIcon(activity.type)}</Box>
                                        <Box sx={{flex: 1, minWidth: 0}}>
                                            <Typography variant="body2" sx={{fontWeight: 600, mb: 0.5}}>
                                                {activity.description}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {activity.timestamp}
                                            </Typography>
                                        </Box>
                                        <Chip
                                            label={getStatusText(activity.status)}
                                            color={getStatusColor(activity.status) as any}
                                            size="small"
                                            sx={{fontWeight: 600}}
                                        />
                                    </Box>
                                ))}
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;