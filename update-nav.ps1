# PowerShell script to update all HTML files with hamburger menu
$htmlFiles = Get-ChildItem -Path "." -Filter "*.html"

foreach ($file in $htmlFiles) {
    $content = Get-Content -Path $file.FullName -Raw
    
    # Skip if already has hamburger menu
    if ($content -match "hamburger-menu") {
        Write-Host "Skipping $($file.Name) - already updated"
        continue
    }
    
    # Add hamburger menu button
    $content = $content -replace '<div class="nav-links">([\s\S]*?)<\/div>', @'
<div class="nav-links">$1</div>
        
        <!-- Hamburger Menu for Mobile -->
        <div class="hamburger-menu">
            <span></span>
            <span></span>
            <span></span>
        </div>
'@
    
    # Add mobile navigation overlay after nav element
    $content = $content -replace '</nav>', @'
</nav>
    
    <!-- Mobile Navigation Overlay -->
    <div class="mobile-nav-overlay">
        <ul class="mobile-nav-links">
            <li><a href="index.html" class="nav-button">Home</a></li>
            <li><a href="images.html" class="nav-button">Images</a></li>
            <li><a href="videos.html" class="nav-button">Videos</a></li>
            <li><a href="create.html" class="nav-button">Create</a></li>
            <li><a href="build.html" class="nav-button">Build</a></li>
            <li><a href="contact.html" class="nav-button">Contact</a></li>
        </ul>
    </div>
'@
    
    # Add mobile-menu.js script reference
    $content = $content -replace '</body>', @'
    <script src="js/mobile-menu.js"></script>
</body>
'@
    
    # Write the updated content back to file
    Set-Content -Path $file.FullName -Value $content
    Write-Host "Updated $($file.Name) with hamburger menu"
}

Write-Host "All HTML files have been updated!"
