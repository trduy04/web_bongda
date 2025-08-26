const express = require('express');
const router = express.Router();

// Mock data cho đội bóng
const teams = [
  {
    id: 1,
    name: 'Manchester United',
    shortName: 'Man Utd',
    league: 'Premier League',
    country: 'England',
    founded: 1878,
    stadium: 'Old Trafford',
    capacity: 74140,
    logo: 'https://example.com/man-utd-logo.png',
    position: 1,
    points: 45,
    played: 20,
    won: 14,
    drawn: 3,
    lost: 3,
    goalsFor: 35,
    goalsAgainst: 15
  },
  {
    id: 2,
    name: 'Liverpool',
    shortName: 'Liverpool',
    league: 'Premier League',
    country: 'England',
    founded: 1892,
    stadium: 'Anfield',
    capacity: 53394,
    logo: 'https://example.com/liverpool-logo.png',
    position: 2,
    points: 42,
    played: 20,
    won: 13,
    drawn: 3,
    lost: 4,
    goalsFor: 38,
    goalsAgainst: 18
  },
  {
    id: 3,
    name: 'Arsenal',
    shortName: 'Arsenal',
    league: 'Premier League',
    country: 'England',
    founded: 1886,
    stadium: 'Emirates Stadium',
    capacity: 60704,
    logo: 'https://example.com/arsenal-logo.png',
    position: 3,
    points: 40,
    played: 20,
    won: 12,
    drawn: 4,
    lost: 4,
    goalsFor: 32,
    goalsAgainst: 16
  }
];

// Lấy tất cả đội bóng
router.get('/', (req, res) => {
  try {
    const { league, country, limit } = req.query;
    
    let filteredTeams = [...teams];
    
    // Lọc theo giải đấu
    if (league) {
      filteredTeams = filteredTeams.filter(team => 
        team.league.toLowerCase().includes(league.toLowerCase())
      );
    }
    
    // Lọc theo quốc gia
    if (country) {
      filteredTeams = filteredTeams.filter(team => 
        team.country.toLowerCase().includes(country.toLowerCase())
      );
    }
    
    // Giới hạn số lượng
    if (limit) {
      filteredTeams = filteredTeams.slice(0, parseInt(limit));
    }
    
    res.json({
      success: true,
      data: filteredTeams,
      total: filteredTeams.length
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Lỗi khi lấy danh sách đội bóng' 
    });
  }
});

// Lấy đội bóng theo ID
router.get('/:id', (req, res) => {
  try {
    const teamId = parseInt(req.params.id);
    const team = teams.find(t => t.id === teamId);
    
    if (!team) {
      return res.status(404).json({ 
        success: false, 
        error: 'Không tìm thấy đội bóng' 
      });
    }
    
    res.json({
      success: true,
      data: team
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Lỗi khi lấy thông tin đội bóng' 
    });
  }
});

// Lấy bảng xếp hạng
router.get('/league/:league/standings', (req, res) => {
  try {
    const { league } = req.params;
    const leagueTeams = teams.filter(team => 
      team.league.toLowerCase() === league.toLowerCase()
    );
    
    // Sắp xếp theo điểm số
    const standings = leagueTeams.sort((a, b) => {
      if (b.points !== a.points) {
        return b.points - a.points;
      }
      return (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst);
    });
    
    res.json({
      success: true,
      data: standings,
      league: league
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Lỗi khi lấy bảng xếp hạng' 
    });
  }
});

// Tạo đội bóng mới
router.post('/', (req, res) => {
  try {
    const { name, shortName, league, country, founded, stadium, capacity } = req.body;
    
    if (!name || !league || !country) {
      return res.status(400).json({
        success: false,
        error: 'Thiếu thông tin bắt buộc'
      });
    }
    
    const newTeam = {
      id: teams.length + 1,
      name,
      shortName: shortName || name,
      league,
      country,
      founded: founded || null,
      stadium: stadium || 'TBD',
      capacity: capacity || 0,
      logo: req.body.logo || null,
      position: 0,
      points: 0,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0
    };
    
    teams.push(newTeam);
    
    res.status(201).json({
      success: true,
      message: 'Tạo đội bóng thành công',
      data: newTeam
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Lỗi khi tạo đội bóng' 
    });
  }
});

// Cập nhật thông tin đội bóng
router.put('/:id', (req, res) => {
  try {
    const teamId = parseInt(req.params.id);
    const teamIndex = teams.findIndex(t => t.id === teamId);
    
    if (teamIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        error: 'Không tìm thấy đội bóng' 
      });
    }
    
    const updatedTeam = { ...teams[teamIndex], ...req.body };
    teams[teamIndex] = updatedTeam;
    
    res.json({
      success: true,
      message: 'Cập nhật đội bóng thành công',
      data: updatedTeam
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Lỗi khi cập nhật đội bóng' 
    });
  }
});

module.exports = router;
