# **Kreator Logo SimLE**
[![Netlify Status](https://api.netlify.com/api/v1/badges/f12eb811-2b34-49a5-899e-e350b714f83c/deploy-status)](https://app.netlify.com/projects/simle-logo/deploys)

Projekt narzędzia do tworzenia sygnetów i logotypów w stylu marki SimLE, oparty na technologii React oraz TypeScript.

## **Wymagania wstępne**

Aby uruchomić projekt, upewnij się, że masz zainstalowane na swoim komputerze:

1. **Node.js** (wersja 18 lub nowsza).  
2. **npm** (dołączony do Node.js) lub **yarn**.

## **Przygotowanie środowiska**

1. **Sklonuj repozytorium** (lub pobierz pliki projektu).  
2. **Zainstaluj zależności**:  
   Otwórz terminal w folderze projektu i wpisz:  
   `npm install`

3. **Uruchom projekt w trybie deweloperskim**:  
   `npm run dev`

   Aplikacja będzie dostępna pod adresem http://localhost:5173 (lub innym wskazanym w terminalu).

## **Funkcjonalności**

* **Interaktywna siatka**: Możliwość malowania trójkątów poprzez kliknięcia i przeciąganie.
* **Zarządzanie kolorami**: Wybór z oficjalnej palety SimLE lub tworzenie własnej palety projektowej.
* **Kolor przewodni**: Możliwość ustawienia koloru przewodniego (gwiazdka), który definiuje barwę nazwy projektu.
* **Wizualizacja na żywo**: Automatyczne renderowanie sygnetu i pełnego logo z nazwą projektu przy użyciu czcionki Science Gothic.
* **Eksport**: Możliwość pobierania projektów jako pliki wektorowe .svg oraz obrazy .png w wysokiej rozdzielczości.
* **Udostępnianie**: Cały stan projektu jest zapisywany w adresie URL (Base64), co umożliwia przesyłanie projektów za pomocą zwykłego linku.

## **Architektura i Rozwiązania Techniczne**

### **Siatka Trójkątów**
Aplikacja wykorzystuje siatkę trójkątów równobocznych ułożonych naprzemiennie (skierowanych w górę i w dół). Pozwala to na tworzenie dynamicznych, geometrycznych kompozycji zgodnych z identyfikacją wizualną SimLE.

### **Algorytm Łączenia Ścieżek (Union Paths)**
W celu optymalizacji plików SVG i zapewnienia idealnego wyglądu (bez białych linii między stykającymi się trójkątami), zastosowano autorski algorytm łączący sąsiadujące trójkąty o tym samym kolorze w jednolite wielokąty:
1. Identyfikacja wszystkich krawędzi trójkątów w danej grupie kolorystycznej.
2. Odfiltrowanie krawędzi wewnętrznych (występujących dwukrotnie).
3. Zbudowanie zamkniętych ścieżek SVG z krawędzi zewnętrznych.

### **Persystencja Stanu**
Projekt nie wymaga bazy danych. Stan (pokolorowane trójkąty, własne kolory, nazwa projektu) jest na bieżąco:
* Synchronizowany z `localStorage`.
* Kodowany do formatu Base64 i dołączany do adresu URL w parametrze `d`.

## **Budowanie aplikacji (dla produkcji)**

Aby wygenerować zoptymalizowaną wersję aplikacji:
`npm run build`

## **Technologie**

*   **React 19**
*   **TypeScript**
*   **Vite**
*   **Tailwind CSS**
*   **Lucide React** (ikony)
*   **Opentype.js** (obsługa czcionek wektorowych)
*   **React Colorful** (picker kolorów)
