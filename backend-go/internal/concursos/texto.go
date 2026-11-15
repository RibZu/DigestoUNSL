package concursos

import (
	"strings"
	"unicode"
	"unicode/utf8"
)

var windows1252 = map[rune]rune{
	0x80: '€', 0x82: '‚', 0x83: 'ƒ', 0x84: '„', 0x85: '…', 0x86: '†', 0x87: '‡',
	0x88: 'ˆ', 0x89: '‰', 0x8A: 'Š', 0x8B: '‹', 0x8C: 'Œ', 0x8E: 'Ž',
	0x91: '‘', 0x92: '’', 0x93: '“', 0x94: '”', 0x95: '•', 0x96: '–', 0x97: '—',
	0x98: '˜', 0x99: '™', 0x9A: 'š', 0x9B: '›', 0x9C: 'œ', 0x9E: 'ž', 0x9F: 'Ÿ',
}

func esLetra(r rune) bool {
	return (r >= 'A' && r <= 'Z') || (r >= 'a' && r <= 'z') || strings.ContainsRune("ÁÉÍÓÚÜáéíóúü", r)
}

func reparar(s string) string {
	runas := []rune(s)
	todasBajas := true
	hayAltas := false
	for _, r := range runas {
		if r > 0xFF {
			todasBajas = false
			break
		}
		if r > 127 {
			hayAltas = true
		}
	}
	if todasBajas && hayAltas {
		bytes := make([]byte, len(runas))
		for i, r := range runas {
			bytes[i] = byte(r)
		}
		if utf8.Valid(bytes) {
			runas = []rune(string(bytes))
		} else {
			for i, r := range runas {
				if cambio, existe := windows1252[r]; existe {
					runas[i] = cambio
				}
			}
		}
	}
	for i := 1; i < len(runas)-1; i++ {
		if runas[i] != '#' || !esLetra(runas[i-1]) || !esLetra(runas[i+1]) {
			continue
		}
		if unicode.IsUpper(runas[i-1]) && unicode.IsUpper(runas[i+1]) {
			runas[i] = 'Ñ'
		} else {
			runas[i] = 'ñ'
		}
	}
	return string(runas)
}
