const express = require('express');
const router = express.Router();

// Mock data cho trận đấu
const matches = [
  {
    id: 1,
    homeTeam: 'Manchester United',
    awayTeam: 'Liverpool',
    homeScore: 2,
    awayScore: 1,
    date: '2024-01-15T20:00:00Z',
    status: 'finished',
    league: 'Premier League',
    venue: 'Old Trafford'
  },
  {
    id: 2,
    homeTeam: 'Arsenal',
    awayTeam: 'Chelsea',
    homeScore: 0,
    awayScore: 0,
    date: '2024-01-20T15:30:00Z',
    status: 'scheduled',
    league: 'Premier League',
    venue: 'Emirates Stadium'
  },
  {
    id: 3,
    homeTeam: 'Barcelona',
    awayTeam: 'Real Madrid',
    homeScore: 3,
    awayScore: 2,
    date: '2024-01-18T21:00:00Z',
    status: 'finished',
    league: 'La Liga',
    venue: 'Camp Nou'
  }
];

// Lấy tất cả trận đấu
router.get('/', (req, res) => {
  try {
    const { league, status, date } = req.query;
    
    let filteredMatches = [...matches];
    
    // Lọc theo giải đấu
    if (league) {
      filteredMatches = filteredMatches.filter(match => 
        match.league.toLowerCase().includes(league.toLowerCase())
      );
    }
    
    // Lọc theo trạng thái
    if (status) {
      filteredMatches = filteredMatches.filter(match => 
        match.status === status
      );
    }
    
    // Lọc theo ngày
    if (date) {
      const searchDate = new Date(date);
      filteredMatches = filteredMatches.filter(match => {
        const matchDate = new Date(match.date);
        return matchDate.toDateString() === searchDate.toDateString();
      });
    }
    
    res.json({
      success: true,
      data: filteredMatches,
      total: filteredMatches.length
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Lỗi khi lấy danh sách trận đấu' 
    });
  }
});

// Lấy trận đấu theo ID
router.get('/:id', (req, res) => {
  try {
    const matchId = parseInt(req.params.id);
    const match = matches.find(m => m.id === matchId);
    
    if (!match) {
      return res.status(404).json({ 
        success: false, 
        error: 'Không tìm thấy trận đấu' 
      });
    }
    
    res.json({
      success: true,
      data: match
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Lỗi khi lấy thông tin trận đấu' 
    });
  }
});

// Tạo trận đấu mới
router.post('/', (req, res) => {
  try {
    const { homeTeam, awayTeam, date, league, venue } = req.body;
    
    if (!homeTeam || !awayTeam || !date || !league) {
      return res.status(400).json({
        success: false,
        error: 'Thiếu thông tin bắt buộc'
      });
    }
    
    const newMatch = {
      id: matches.length + 1,
      homeTeam,
      awayTeam,
      homeScore: 0,
      awayScore: 0,
      date,
      status: 'scheduled',
      league,
      venue: venue || 'TBD'
    };
    
    matches.push(newMatch);
    
    res.status(201).json({
      success: true,
      message: 'Tạo trận đấu thành công',
      data: newMatch
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Lỗi khi tạo trận đấu' 
    });
  }
});

// Cập nhật trận đấu
router.put('/:id', (req, res) => {
  try {
    const matchId = parseInt(req.params.id);
    const matchIndex = matches.findIndex(m => m.id === matchId);
    
    if (matchIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        error: 'Không tìm thấy trận đấu' 
      });
    }
    
    const updatedMatch = { ...matches[matchIndex], ...req.body };
    matches[matchIndex] = updatedMatch;
    
    res.json({
      success: true,
      message: 'Cập nhật trận đấu thành công',
      data: updatedMatch
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Lỗi khi cập nhật trận đấu' 
    });
  }
});

// Xóa trận đấu
router.delete('/:id', (req, res) => {
  try {
    const matchId = parseInt(req.params.id);
    const matchIndex = matches.findIndex(m => m.id === matchId);
    
    if (matchIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        error: 'Không tìm thấy trận đấu' 
      });
    }
    
    matches.splice(matchIndex, 1);
    
    res.json({
      success: true,
      message: 'Xóa trận đấu thành công'
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Lỗi khi xóa trận đấu' 
    });
  }
});

module.exports = router;
