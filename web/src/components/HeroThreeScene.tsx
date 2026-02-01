'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function HeroThreeScene() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)
    containerRef.current.appendChild(renderer.domElement)

    camera.position.z = 15

    // Create minimal craft-inspired graphics group
    const craftGroup = new THREE.Group()
    scene.add(craftGroup)

    const color = 0xC4A896 // Warm beige/tan color

    // Helper function to create simple circles/rings
    const createCircles = (x: number, y: number, z: number, count: number, maxRadius: number, opacity: number) => {
      const group = new THREE.Group()
      for (let i = 0; i < count; i++) {
        const radius = (i + 1) * (maxRadius / count)
        const geometry = new THREE.TorusGeometry(radius, 0.05, 8, 32)
        const material = new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: opacity * (1 - i / count),
        })
        const ring = new THREE.Mesh(geometry, material)
        group.add(ring)
      }
      group.position.set(x, y, z)
      return group
    }

    // Helper function to create simple dots
    const createDot = (x: number, y: number, z: number, radius: number, opacity: number) => {
      const geometry = new THREE.SphereGeometry(radius, 8, 8)
      const material = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity,
      })
      const sphere = new THREE.Mesh(geometry, material)
      sphere.position.set(x, y, z)
      return sphere
    }

    // Helper function to create simple X/cross
    const createCross = (x: number, y: number, z: number, size: number, opacity: number) => {
      const group = new THREE.Group()
      
      // Line 1
      const points1 = [new THREE.Vector3(-size, size, 0), new THREE.Vector3(size, -size, 0)]
      const geom1 = new THREE.BufferGeometry().setFromPoints(points1)
      const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity, linewidth: 1 })
      group.add(new THREE.Line(geom1, mat))

      // Line 2
      const points2 = [new THREE.Vector3(size, size, 0), new THREE.Vector3(-size, -size, 0)]
      const geom2 = new THREE.BufferGeometry().setFromPoints(points2)
      group.add(new THREE.Line(geom2, new THREE.LineBasicMaterial({ color, transparent: true, opacity, linewidth: 1 })))

      group.position.set(x, y, z)
      return group
    }

    // Helper function to create horizontal lines (textile pattern)
    const createHorizontalLines = (x: number, y: number, z: number, count: number, spacing: number, opacity: number) => {
      const group = new THREE.Group()
      for (let i = 0; i < count; i++) {
        const points = [new THREE.Vector3(-2, i * spacing - (count * spacing) / 2, 0), new THREE.Vector3(2, i * spacing - (count * spacing) / 2, 0)]
        const geometry = new THREE.BufferGeometry().setFromPoints(points)
        const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity })
        group.add(new THREE.Line(geometry, material))
      }
      group.position.set(x, y, z)
      return group
    }

    // Add simple scattered dots (top area)
    craftGroup.add(createDot(-8, 8, -5, 0.25, 0.4)) // Top left
    craftGroup.add(createDot(0, 9, -5, 0.15, 0.3))  // Top center
    craftGroup.add(createDot(8, 7, -5, 0.2, 0.35))  // Top right

    // Add subtle mandala/concentric circles (left side)
    craftGroup.add(createCircles(-8, 2, -8, 4, 2, 0.25))

    // Add another mandala (bottom center - faint)
    craftGroup.add(createCircles(-2, -8, -8, 3, 1.5, 0.15))

    // Add concentric circles top right (large, subtle)
    craftGroup.add(createCircles(10, 6, -8, 4, 3, 0.2))

    // Add horizontal lines on right (textile pattern)
    craftGroup.add(createHorizontalLines(9, 2, -8, 5, 0.5, 0.2))

    // Add scattered decorative elements
    craftGroup.add(createCross(5, 5, -5, 0.4, 0.25))   // Top center-right
    craftGroup.add(createCross(-5, -6, -5, 0.3, 0.2))  // Bottom left
    craftGroup.add(createDot(7, -7, -5, 0.1, 0.25))    // Bottom right
    
    // Bottom dots (decorative row)
    craftGroup.add(createDot(-1.5, -9.5, -5, 0.15, 0.3))
    craftGroup.add(createDot(0, -9.5, -5, 0.15, 0.3))
    craftGroup.add(createDot(1.5, -9.5, -5, 0.15, 0.3))

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
    scene.add(ambientLight)

    // Warm pottery kiln-like glow
    const glowLight = new THREE.PointLight(0xE8A76A, 0.8)
    glowLight.position.set(0, 5, 10)
    scene.add(glowLight)

    const sideLight = new THREE.PointLight(0xC9845E, 0.4)
    sideLight.position.set(-10, 0, 5)
    scene.add(sideLight)

    // Animation loop - very subtle
    const animate = () => {
      requestAnimationFrame(animate)

      // Extremely subtle rotation
      craftGroup.rotation.z += 0.00005

      renderer.render(scene, camera)
    }

    animate()

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      containerRef.current?.removeChild(renderer.domElement)
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 opacity-20"
      style={{ pointerEvents: 'none' }}
    />
  )
}
