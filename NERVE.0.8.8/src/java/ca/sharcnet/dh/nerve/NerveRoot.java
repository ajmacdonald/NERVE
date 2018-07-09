package ca.sharcnet.dh.nerve;
import ca.frar.jjjrmi.annotations.JJJ;
import ca.frar.jjjrmi.annotations.NativeJS;
import ca.frar.jjjrmi.socket.JJJObject;
import ca.frar.utility.console.Console;
import java.io.IOException;
import java.sql.SQLException;

@JJJ
public class NerveRoot extends JJJObject{
    private Scriber scriber = new Scriber();
    private ProgressMonitor progressMonitor;
    private Dictionary dictionary;

    NerveRoot() throws IOException, ClassNotFoundException, IllegalAccessException, SQLException, InstantiationException {
        this.dictionary = new Dictionary();
        progressMonitor = new ProgressMonitor();
        this.scriber.setProgressListener(progressMonitor);
        this.scriber.addEncodeListener(dictionary);
    }
    
    /**
     * @return the scriber
     */
    @NativeJS
    public Scriber getScriber() {
        return scriber;
    }

    /**
     * @return the dictionary
     */
    @NativeJS
    public Dictionary getDictionary() {
        return dictionary;
    }    
    
    /**
     * @return the dictionary
     */
    @NativeJS
    public ProgressMonitor getProgressMonitor() {
        return progressMonitor;
    }        
}
