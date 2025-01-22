export const moveProjectTable = () => {
    return app.gulp.src(app.path.src.projectTable)
        .pipe(app.gulp.dest(app.path.build.projectTable))
}