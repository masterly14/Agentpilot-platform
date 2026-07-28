# Normaliza los logos de clientes a PNG blanco monocromo con fondo transparente.
#
# Cada archivo original llega distinto: unos ya traen canal alfa, otros vienen
# con fondo opaco (azul en Zapata, una foto de edificios en M&G, blanco en
# Tequendama). El modo define de dónde sale la máscara de opacidad:
#   alpha       -> se reutiliza el canal alfa del original
#   luma        -> la luminancia (marca clara sobre fondo oscuro)
#   luma-invert -> la luminancia negada (marca oscura sobre fondo claro)
#
# El umbral se aplica con lutyuv y no con curves: curves interpola con spline
# cúbica y deja alfa residual bajo el umbral, que se ve como un halo del fondo
# original. lutyuv recorta al rango válido, así que `(val-umbral)*pendiente` da
# un corte duro con apenas unos niveles de antialias en el borde.
#
# Al final se recorta el margen vacío para que todos tengan el mismo tamaño
# óptico dentro de la retícula.

$ffmpeg = "C:\Users\Santiago\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1.2-full_build\bin\ffmpeg.exe"

$logos = @(
  @{ out = "zapata";     src = "public\logo-zapata-hospitality.png"; mode = "luma";        threshold = 70  }
  @{ out = "cozy";       src = "public\logos_rgb-01-1.png";          mode = "alpha";       threshold = 0   }
  @{ out = "mg";         src = "public\mg-apartments-logo.png";      mode = "luma";        threshold = 120 }
  @{ out = "spothost";   src = "public\Logo-spotHost.webp";          mode = "alpha";       threshold = 0   }
  @{ out = "urus";       src = "public\logo-urus.png";               mode = "alpha";       threshold = 0   }
  @{ out = "tequendama"; src = "public\admin-tequendama-logo.jpg";   mode = "luma-invert"; threshold = 45  }
)

New-Item -ItemType Directory -Force -Path public\logos | Out-Null

foreach ($logo in $logos) {
  $dest = "public\logos\$($logo.out).png"

  $mask = switch ($logo.mode) {
    "alpha"       { "alphaextract" }
    "luma"        { "format=gray" }
    "luma-invert" { "format=gray,negate" }
  }
  if ($logo.threshold -gt 0) { $mask = "$mask,lutyuv=y='(val-$($logo.threshold))*20'" }

  $fc = "[0:v]split[a][b];[a]$mask[m];[b]format=rgba,lutrgb=r=255:g=255:b=255[w];[w][m]alphamerge[out]"
  & $ffmpeg -y -loglevel error -i $logo.src -filter_complex $fc -map "[out]" $dest

  # Recorta el margen transparente usando el canal alfa como referencia.
  $probe = & $ffmpeg -loglevel info -i $dest -vf "alphaextract,cropdetect=limit=1:round=2:skip=0:reset=1" -frames:v 1 -f null - 2>&1 | Out-String
  $found = [regex]::Matches($probe, 'crop=(\d+):(\d+):(\d+):(\d+)')
  if ($found.Count -gt 0) {
    $box = $found[$found.Count - 1].Value
    $chain = if ([int]$found[$found.Count - 1].Groups[1].Value -gt 900) { "$box,scale=900:-1" } else { $box }
    & $ffmpeg -y -loglevel error -i $dest -vf $chain "$dest.tmp.png"
    Move-Item -Force "$dest.tmp.png" $dest
  }

  Write-Host "generado: $($logo.out).png"
}
