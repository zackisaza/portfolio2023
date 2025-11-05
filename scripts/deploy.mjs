#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync, rmSync, cpSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const deployRepo = 'https://github.com/zackisaza/portfolio2024.git';
const tempDeployDir = join(projectRoot, '.deploy-temp');

const deployProject = async () => {
  console.log('🚀 Iniciando proceso de deploy...');

  try {
    // 1. Limpiar directorio temporal si existe
    if (existsSync(tempDeployDir)) {
      console.log('🧹 Limpiando directorio temporal...');
      rmSync(tempDeployDir, { recursive: true, force: true });
    }

    // 2. Construir el proyecto
    console.log('🔨 Construyendo el proyecto...');
    execSync('npm run build', { 
      cwd: projectRoot, 
      stdio: 'inherit' 
    });

    // 3. Clonar el repositorio de deploy
    console.log('📥 Clonando repositorio de deploy...');
    execSync(`git clone "${deployRepo}" "${tempDeployDir}"`, { 
      stdio: 'inherit' 
    });

    // 4. Limpiar el contenido del repositorio de deploy (excepto .git)
    console.log('🧹 Limpiando repositorio de deploy...');
    const deployContents = execSync('ls -la', { 
      cwd: tempDeployDir, 
      encoding: 'utf8' 
    }).split('\n');
    
    for (const item of deployContents) {
      const fileName = item.split(/\s+/).pop();
      if (fileName && fileName !== '.' && fileName !== '..' && fileName !== '.git') {
        const itemPath = join(tempDeployDir, fileName);
        if (existsSync(itemPath)) {
          rmSync(itemPath, { recursive: true, force: true });
        }
      }
    }

    // 5. Copiar archivos del build
    console.log('📋 Copiando archivos del build...');
    const distDir = join(projectRoot, 'dist');
    if (!existsSync(distDir)) {
      throw new Error('❌ Directorio dist no encontrado. ¿Se ejecutó el build correctamente?');
    }

    cpSync(distDir, tempDeployDir, { 
      recursive: true,
      filter: (src, dest) => {
        // No copiar la carpeta .git del dist (si existiera)
        return !src.includes('.git');
      }
    });

    // 6. Verificar si hay cambios
    const gitStatus = execSync('git status --porcelain', { 
      cwd: tempDeployDir, 
      encoding: 'utf8' 
    });

    console.log('📊 Git status:', gitStatus.trim() || 'Sin cambios detectados');

    // Forzar deploy por ahora para solucionar el problema
    // if (!gitStatus.trim()) {
    //   console.log('✅ No hay cambios para deploy. El build es idéntico al deploy actual.');
    //   rmSync(tempDeployDir, { recursive: true, force: true });
    //   return;
    // }

    // 7. Hacer commit y push
    console.log('📤 Haciendo commit y push...');
    
    // Configurar git user si no está configurado
    try {
      execSync('git config user.name', { cwd: tempDeployDir, stdio: 'pipe' });
    } catch {
      execSync('git config user.name "Deploy Bot"', { cwd: tempDeployDir });
    }
    
    try {
      execSync('git config user.email', { cwd: tempDeployDir, stdio: 'pipe' });
    } catch {
      execSync('git config user.email "deploy@portfolio.com"', { cwd: tempDeployDir });
    }

    // Añadir todos los archivos
    execSync('git add .', { cwd: tempDeployDir, stdio: 'inherit' });
    
    // Crear commit con timestamp (permitir commits vacíos si no hay cambios)
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const commitFlags = gitStatus.trim() ? '' : '--allow-empty';
    execSync(`git commit ${commitFlags} -m "Deploy: ${timestamp}"`, { 
      cwd: tempDeployDir, 
      stdio: 'inherit' 
    });
    
    // Push al repositorio
    execSync('git push origin main', { 
      cwd: tempDeployDir, 
      stdio: 'inherit' 
    });

    console.log('✅ Deploy completado exitosamente!');
    console.log(`🌐 Sitio desplegado en: ${deployRepo}`);

  } catch (error) {
    console.error('❌ Error durante el deploy:', error.message);
    process.exit(1);
  } finally {
    // Limpiar directorio temporal
    if (existsSync(tempDeployDir)) {
      rmSync(tempDeployDir, { recursive: true, force: true });
    }
  }
};

// Ejecutar el deploy
deployProject();