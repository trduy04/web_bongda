const express = require('express');
const router = express.Router();

// Mock data cho giải đấu
const leagues = [
  {
    id: 1,
    name: 'Premier League',
    country: 'England',
    founded: 1992,
    currentSeason: '2023/24',
    logo: 'https://example.com/premier-league-logo.png',
    description: 'Giải đấu hàng đầu nước Anh',
    teams: 20,
    matches: 380,
    status: 'active'
  },
  {
    id: 2,
    name: 'La Liga',
    country: 'Spain',
    founded: 1929,
    currentSeason: '2023/24',
    logo: 'https://example.com/la-liga-logo.png',
    description: 'Giải đấu hàng đầu Tây Ban Nha',
    teams: 20,
    matches: 380,
    status: 'active'
  },
  {
    id: 3,
    name: 'Bundesliga',
    country: 'Germany',
    founded: 1963,
    currentSeason: '2023/24',
    logo: 'https://example.com/bundesliga-logo.png',
    description: 'Giải đấu hàng đầu Đức',
    teams: 18,
    matches: 306,
    status: 'active'
  },
  {
    id: 4,
    name: 'Serie A',
    country: 'Italy',
    founded: 1898,
    currentSeason: '2023/24',
    logo: 'https://example.com/serie-a-logo.png',
    description: 'Giải đấu hàng đầu Italia',
    teams: 20,
    matches: 380,
    status: 'active'
  }
];

// Lấy tất cả giải đấu
router.get('/', (req, res) => {
  try {
    const { country, status, limit } = req.query;
    
    let filteredLeagues = [...leagues];
    
    // Lọc theo quốc gia
    if (country) {
      filteredLeagues = filteredLeagues.filter(league => 
        league.country.toLowerCase().includes(country.toLowerCase())
      );
    }
    
    // Lọc theo trạng thái
    if (status) {
      filteredLeagues = filteredLeagues.filter(league => 
        league.status === status
      );
    }
    
    // Giới hạn số lượng
    if (limit) {
      filteredLeagues = filteredLeagues.slice(0, parseInt(limit));
    }
    
    res.json({
      success: true,
      data: filteredLeagues,
      total: filteredLeagues.length
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Lỗi khi lấy danh sách giải đấu' 
    });
  }
});

// Lấy giải đấu theo ID
router.get('/:id', (req, res) => {
  try {
    const leagueId = parseInt(req.params.id);
    const league = leagues.find(l => l.id === leagueId);
    
    if (!league) {
      return res.status(404).json({ 
        success: false, 
        error: 'Không tìm thấy giải đấu' 
      });
    }
    
    res.json({
      success: true,
      data: league
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Lỗi khi lấy thông tin giải đấu' 
    });
  }
});

// Lấy thống kê giải đấu
router.get('/:id/stats', (req, res) => {
  try {
    const leagueId = parseInt(req.params.id);
    const league = leagues.find(l => l.id === leagueId);
    
    if (!league) {
      return res.status(404).json({ 
        success: false, 
        error: 'Không tìm thấy giải đấu' 
      });
    }
    
    // Mock thống kê
    const stats = {
      leagueId: league.id,
      leagueName: league.name,
      totalTeams: league.teams,
      totalMatches: league.matches,
      matchesPlayed: Math.floor(league.matches * 0.7), // 70% trận đã đấu
      matchesRemaining: Math.ceil(league.matches * 0.3), // 30% trận còn lại
      topScorer: {
        name: 'Erling Haaland',
        team: 'Manchester City',
        goals: 18
      },
      mostAssists: {
        name: 'Kevin De Bruyne',
        team: 'Manchester City',
        assists: 12
      },
      cleanSheets: {
        name: 'David Raya',
        team: 'Arsenal',
        cleanSheets: 8
      }
    };
    
    res.json({
      success: true,
      data: stats
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Lỗi khi lấy thống kê giải đấu' 
    });
  }
});

// Tạo giải đấu mới
router.post('/', (req, res) => {
  try {
    const { name, country, founded, currentSeason, description, teams } = req.body;
    
    if (!name || !country || !currentSeason) {
      return res.status(400).json({
        success: false,
        error: 'Thiếu thông tin bắt buộc'
      });
    }
    
    const newLeague = {
      id: leagues.length + 1,
      name,
      country,
      founded: founded || null,
      currentSeason,
      logo: req.body.logo || null,
      description: description || '',
      teams: teams || 20,
      matches: (teams || 20) * ((teams || 20) - 1), // Công thức tính số trận
      status: 'active'
    };
    
    leagues.push(newLeague);
    
    res.status(201).json({
      success: true,
      message: 'Tạo giải đấu thành công',
      data: newLeague
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Lỗi khi tạo giải đấu' 
    });
  }
});

// Cập nhật thông tin giải đấu
router.put('/:id', (req, res) => {
  try {
    const leagueId = parseInt(req.params.id);
    const leagueIndex = leagues.findIndex(l => l.id === leagueId);
    
    if (leagueIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        error: 'Không tìm thấy giải đấu' 
      });
    }
    
    const updatedLeague = { ...leagues[leagueIndex], ...req.body };
    leagues[leagueIndex] = updatedLeague;
    
    res.json({
      success: true,
      message: 'Cập nhật giải đấu thành công',
      data: updatedLeague
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Lỗi khi cập nhật giải đấu' 
    });
  }
});

// Xóa giải đấu
router.delete('/:id', (req, res) => {
  try {
    const leagueId = parseInt(req.params.id);
    const leagueIndex = leagues.findIndex(l => l.id === leagueId);
    
    if (leagueIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        error: 'Không tìm thấy giải đấu' 
      });
    }
    
    leagues.splice(leagueIndex, 1);
    
    res.json({
      success: true,
      message: 'Xóa giải đấu thành công'
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Lỗi khi xóa giải đấu' 
    });
  }
});

module.exports = router;
