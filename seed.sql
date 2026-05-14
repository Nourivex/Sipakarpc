-- Seed Data for SipakarPC (Based on Implementation of Certainty Factor Method PDF)

-- 1. Insert Components (Table 1)
INSERT INTO components (name, description, icon) VALUES
('Motherboard', 'Papan induk yang menghubungkan semua komponen utama komputer', 'CircuitBoard'),
('Processor', 'Unit pemroses pusat (CPU) yang merupakan otak dari komputer', 'Cpu'),
('RAM', 'Random Access Memory, media penyimpanan data sementara', 'MemoryStick'),
('VGA Card', 'Kartu grafis untuk mengolah dan menampilkan visual ke layar', 'Monitor'),
('Power Supplay', 'Unit penyedia daya listrik untuk seluruh komponen PC', 'Zap'),
('Harddisk', 'Media penyimpanan data permanen berkapasitas besar', 'HardDrive'),
('Monitor', 'Perangkat output visual utama komputer', 'Monitor'),
('Overheat', 'Kondisi suhu berlebih pada komponen yang mengganggu sistem', 'Thermometer')
ON CONFLICT (name) DO NOTHING;

-- 2. Insert Symptoms (Table 2)
INSERT INTO symptoms (code, description, category) VALUES
('E01', 'There is no display on the computer screen', 'Tampilan'),
('E02', 'The indicator light on the front panel lights up', 'Daya'),
('E03', 'Long beeps when the computer is turned on', 'Suara & Boot'),
('E04', 'A short circuit occurs when the computer is turned on', 'Daya'),
('E05', 'The operating system is off, the cursor does not appear on the screen', 'Sistem'),
('E06', 'The processor fan is not running and the processor is not hot', 'Pendingin'),
('E07', 'The system sounds at startup', 'Suara & Boot'),
('E08', 'SO doesn''t want to boot', 'Suara & Boot'),
('E09', 'Computer performance is slowing down', 'Performa'),
('E10', 'Computers often restart themselves without restarting', 'Sistem'),
('E11', 'The monitor suddenly becomes bluescreen', 'Tampilan'),
('E12', 'The computer fails to boot and beepscomputer filed and sounds beep', 'Suara & Boot'),
('E13', 'Often fails when installing new software', 'Sistem'),
('E14', 'Graphic performance is slow when playing games or image editors', 'Tampilan'),
('E15', 'Can enter bios, but VGA does not work after entering the operating system', 'Tampilan'),
('E16', 'The resolution and color quality of the monitor is not optimal', 'Tampilan'),
('E17', 'Windows is often not responding and graphics performance feels heavy', 'Performa'),
('E18', 'The PC does not react anything and the power indicator does not turn on', 'Penyimpanan'),
('E19', 'The message "Harddisk Error, Hard Disk Failur" appears on the monitor', 'Penyimpanan'),
('E20', 'The message "Operating System Not Found" appears on the monitor', 'Penyimpanan'),
('E21', 'There is no round sound and activity on the hard drive', 'Penyimpanan'),
('E22', 'The display on the blank monitor is white', 'Tampilan'),
('E23', 'The monitor doesn''t turn on at all', 'Tampilan'),
('E24', 'Color contrast on the monitor is blurry', 'Tampilan'),
('E25', 'The computer dies suddenly while in use', 'Daya'),
('E26', 'Computer blank / Freezy', 'Performa'),
('E27', 'Computer loading starts slowly after being used several hours nonstop', 'Penyimpanan'),
('E28', 'The temperature on the PC becomes very hot from normal conditions', 'Pendingin')
ON CONFLICT (code) DO NOTHING;

-- 3. Insert KB Rules with MB/MD (Table 4)
INSERT INTO kb_rules (symptom_code, component_name, mb_value, md_value) VALUES
-- Motherboard
('E01', 'Motherboard', 0.80, 0.50),
('E02', 'Motherboard', 0.85, 0.40),
('E03', 'Motherboard', 0.90, 0.50),
('E04', 'Motherboard', 0.70, 0.50),
-- Processor
('E05', 'Processor', 0.80, 0.50),
('E06', 'Processor', 0.90, 0.70),
('E07', 'Processor', 0.80, 0.60),
('E08', 'Processor', 0.85, 0.60),
-- RAM
('E09', 'RAM', 0.85, 0.50),
('E10', 'RAM', 0.90, 0.50),
('E11', 'RAM', 0.85, 0.50),
('E12', 'RAM', 0.85, 0.50),
('E13', 'RAM', 0.85, 0.50),
-- VGA Card
('E14', 'VGA Card', 0.95, 0.60),
('E15', 'VGA Card', 0.90, 0.50),
('E16', 'VGA Card', 0.85, 0.60),
('E17', 'VGA Card', 0.80, 0.50),
-- Power Supplay
('E02', 'Power Supplay', 0.85, 0.50),
('E04', 'Power Supplay', 0.90, 0.70),
('E18', 'Power Supplay', 0.95, 0.50),
-- Harddisk
('E17', 'Harddisk', 0.85, 0.50),
('E19', 'Harddisk', 0.95, 0.60),
('E20', 'Harddisk', 0.90, 0.50),
('E21', 'Harddisk', 0.95, 0.70),
-- Monitor
('E16', 'Monitor', 0.75, 0.50),
('E22', 'Monitor', 0.95, 0.60),
('E23', 'Monitor', 0.80, 0.50),
('E24', 'Monitor', 0.80, 0.50),
-- Overheat
('E25', 'Overheat', 0.90, 0.50),
('E26', 'Overheat', 0.90, 0.70),
('E27', 'Overheat', 0.90, 0.50),
('E28', 'Overheat', 0.95, 0.70)
ON CONFLICT (symptom_code, component_name) DO UPDATE SET
mb_value = EXCLUDED.mb_value,
md_value = EXCLUDED.md_value;
